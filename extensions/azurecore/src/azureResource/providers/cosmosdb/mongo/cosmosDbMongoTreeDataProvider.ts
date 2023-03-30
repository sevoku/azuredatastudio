/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { TreeItemCollapsibleState, ExtensionContext } from 'vscode';
import * as nls from 'vscode-nls';
const localize = nls.loadMessageBundle();

import { AzureResourceItemType } from '../../../constants';
import { AzureResourceMongoDatabaseServer } from './cosmosDbMongoService';
import { generateGuid } from '../../../utils';
import { IAzureResourceService } from '../../../interfaces';
import { ResourceTreeDataProviderBase } from '../../resourceTreeDataProviderBase';
import { AzureAccountProperties } from 'azurecore';
import * as azdata from 'azdata';

export class CosmosDbMongoTreeDataProvider extends ResourceTreeDataProviderBase<AzureResourceMongoDatabaseServer> {
	private static readonly COSMOSDG_MONGO_PROVIDER_ID = 'COSMOSDB_MONGO';
	private static readonly CONTAINER_ID = 'azure.resource.providers.databaseServer.treeDataProvider.cosmosDbMongoContainer';
	private static readonly CONTAINER_LABEL = localize('azure.resource.providers.databaseServer.treeDataProvider.cosmosDbMongoContainerLabel', "CosmosDB for Mongo");

	public constructor(
		databaseServerService: IAzureResourceService<AzureResourceMongoDatabaseServer>,
		private _extensionContext: ExtensionContext
	) {
		super(databaseServerService);
	}

	protected getTreeItemForResource(databaseServer: AzureResourceMongoDatabaseServer, account: azdata.Account): azdata.TreeItem {
		return {
			id: `Cosmosdb_${databaseServer.id ? databaseServer.id : databaseServer.name}`,
			label: `${databaseServer.name} (CosmosDB Mongo API)`,
			iconPath: {
				dark: this._extensionContext.asAbsolutePath('resources/dark/cosmosdb_inverse.svg'),
				light: this._extensionContext.asAbsolutePath('resources/light/cosmosdb.svg')
			},
			collapsibleState: TreeItemCollapsibleState.None,
			contextValue: AzureResourceItemType.cosmosDBMongoAccount,
			payload: {
				id: generateGuid(),
				connectionName: databaseServer.name,
				serverName: databaseServer.fullName,
				userName: databaseServer.loginName,
				password: '',
				authenticationType: databaseServer.isServer ? azdata.connection.AuthenticationType.SqlLogin : azdata.connection.AuthenticationType.AzureMFA,
				savePassword: true,
				groupFullName: '',
				groupId: '',
				providerName: CosmosDbMongoTreeDataProvider.COSMOSDG_MONGO_PROVIDER_ID,
				saveProfile: false,
				options: {
					isServer: databaseServer.isServer,
				},
				azureAccount: account.key.accountId,
				azureTenantId: databaseServer.tenant,
				azureResourceId: databaseServer.id,
				azurePortalEndpoint: (account.properties as AzureAccountProperties).providerSettings.settings.portalEndpoint
			},
			childProvider: CosmosDbMongoTreeDataProvider.COSMOSDG_MONGO_PROVIDER_ID,
			type: azdata.ExtensionNodeType.Server
		};
	}

	public async getRootChildren(): Promise<azdata.TreeItem[]> {
		return [{
			id: CosmosDbMongoTreeDataProvider.CONTAINER_ID,
			label: CosmosDbMongoTreeDataProvider.CONTAINER_LABEL,
			iconPath: {
				dark: this._extensionContext.asAbsolutePath('resources/dark/folder_inverse.svg'),
				light: this._extensionContext.asAbsolutePath('resources/light/folder.svg')
			},
			collapsibleState: TreeItemCollapsibleState.Collapsed,
			contextValue: AzureResourceItemType.databaseServerContainer
		}];
	}
}
