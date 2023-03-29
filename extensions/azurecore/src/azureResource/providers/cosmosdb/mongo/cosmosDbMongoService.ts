/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { ResourceServiceBase, GraphData } from '../../resourceTreeDataProviderBase';
import { azureResource } from 'azurecore';
import { cosmosMongoDbQuery } from '../../queryStringConstants';


interface DbServerGraphData extends GraphData {
	properties: {
		fullyQualifiedDomainName: string;
		administratorLogin: string;
	};
}

export interface AzureResourceMongoDatabaseServer extends azureResource.AzureResourceDatabaseServer {
	isServer: boolean;
}

export class CosmosDbMongoService extends ResourceServiceBase<DbServerGraphData, AzureResourceMongoDatabaseServer> {

	protected get query(): string {
		return cosmosMongoDbQuery;
	}

	protected convertResource(resource: DbServerGraphData): AzureResourceMongoDatabaseServer {
		return {
			id: resource.id,
			name: resource.name,
			isServer: resource.type === azureResource.AzureResourceType.cosmosDbCluster,
			fullName: resource.properties.fullyQualifiedDomainName,
			loginName: resource.properties.administratorLogin,
			defaultDatabaseName: '',
			tenant: resource.tenantId,
			subscription: {
				id: resource.subscriptionId,
				name: resource.subscriptionName || ''
			}
		};
	}
}
