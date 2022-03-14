/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import { ITreeNodeInfo } from 'vscode-mssql';
import { getAzdataApi, getVscodeMssqlApi } from './common/utils';
import { launchAddSqlBindingQuickpick } from './dialogs/addSqlBindingQuickpick';
import { createAzureFunction } from './services/azureFunctionsService';

export async function activate(context: vscode.ExtensionContext): Promise<void> {
	const vscodeMssqlApi = await getVscodeMssqlApi();

	void vscode.commands.executeCommand('setContext', 'azdataAvailable', !!getAzdataApi());
	// register the add sql binding command
	context.subscriptions.push(vscode.commands.registerCommand('sqlBindings.addSqlBinding', async (uri: vscode.Uri | undefined) => { return launchAddSqlBindingQuickpick(uri); }));
	// Generate Azure Function command
	context.subscriptions.push(vscode.commands.registerCommand('sqlBindings.createAzureFunction', async (node: ITreeNodeInfo) => {
		let connectionInfo = node.connectionInfo;
		// set the database containing the selected table so it can be used
		// for the initial catalog property of the connection string
		let newNode: ITreeNodeInfo = node;
		while (newNode) {
			if (newNode.nodeType === 'Database') {
				connectionInfo.database = newNode.metadata.name;
				break;
			} else {
				newNode = newNode.parentNode;
			}
		}
		const connectionDetails = vscodeMssqlApi.createConnectionDetails(connectionInfo);
		const connectionString = await vscodeMssqlApi.getConnectionString(connectionDetails, false, false);
		await createAzureFunction(connectionString, node.metadata.schema, node.metadata.name);
	}));
}

export function deactivate(): void {
}