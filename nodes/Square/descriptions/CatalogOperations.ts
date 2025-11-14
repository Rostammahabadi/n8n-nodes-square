import type { INodeProperties } from 'n8n-workflow';

export const catalogOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'get',
		options: [
			{
				name: 'Batch Retrieve',
				value: 'batchRetrieve',
				description: 'Returns a set of objects based on the provided IDs',
				action: 'Batch retrieve catalog objects',
			},
			{
				name: 'Batch Upsert',
				value: 'batchUpsert',
				description: 'Creates or updates up to 10,000 target objects',
				action: 'Batch upsert catalog objects',
			},
			{
				name: 'Get Catalog Info',
				value: 'getCatalogInfo',
				description: 'Retrieves information about the Square Catalog API',
				action: 'Get catalog info',
			},
			{
				name: 'Get Object',
				value: 'get',
				description: 'Get a single catalog object',
				action: 'Get a catalog object',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all catalog objects of specified types',
				action: 'List catalog objects',
			},
			{
				name: 'Search Items',
				value: 'searchItems',
				description: 'Search for catalog items or item variations',
				action: 'Search catalog items',
			},
			{
				name: 'Search Objects',
				value: 'searchObjects',
				description: 'Search for catalog objects of any type',
				action: 'Search catalog objects',
			},
			{
				name: 'Update Item Modifier Lists',
				value: 'updateItemModifierLists',
				description: 'Update modifier lists for catalog items',
				action: 'Update item modifier lists',
			},
		],
		displayOptions: {
			show: {
				resource: ['catalog'],
			},
		},
	},
];

export const catalogFields: INodeProperties[] = [
	// ----------------------------------
	//         catalog:get
	// ----------------------------------
	{
		displayName: 'Object ID',
		name: 'objectId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['get'],
			},
		},
		description: 'The ID of the catalog object to retrieve',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Include Related Objects',
				name: 'include_related_objects',
				type: 'boolean',
				default: false,
				description: 'Whether to include additional objects referenced by this object',
			},
			{
				displayName: 'Catalog Version',
				name: 'catalog_version',
				type: 'number',
				default: 0,
				description: 'The specific version of the catalog object to retrieve',
			},
		],
	},

	// ----------------------------------
	//         catalog:list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['list'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['list'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Types',
				name: 'types',
				type: 'string',
				default: '',
				description:
					'Comma-separated list of object types to retrieve (e.g., ITEM,CATEGORY,DISCOUNT)',
				placeholder: 'ITEM,CATEGORY,DISCOUNT',
			},
			{
				displayName: 'Catalog Version',
				name: 'catalog_version',
				type: 'number',
				default: 0,
				description: 'The specific version of the catalog to retrieve',
			},
		],
	},

	// ----------------------------------
	//         catalog:batchRetrieve
	// ----------------------------------
	{
		displayName: 'Object IDs',
		name: 'objectIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['batchRetrieve'],
			},
		},
		description: 'Comma-separated list of catalog object IDs to retrieve',
		placeholder: 'ABC123,DEF456,GHI789',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['batchRetrieve'],
			},
		},
		options: [
			{
				displayName: 'Include Related Objects',
				name: 'include_related_objects',
				type: 'boolean',
				default: false,
				description: 'Whether to include additional objects referenced by these objects',
			},
			{
				displayName: 'Catalog Version',
				name: 'catalog_version',
				type: 'number',
				default: 0,
				description: 'The specific version of the catalog objects to retrieve',
			},
		],
	},

	// ----------------------------------
	//         catalog:batchUpsert
	// ----------------------------------
	{
		displayName: 'Idempotency Key',
		name: 'idempotencyKey',
		type: 'string',
		required: true,
		default: '={{$json.idempotencyKey || $runIndex}}',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['batchUpsert'],
			},
		},
		description: 'A unique key to ensure this batch operation is only applied once',
	},
	{
		displayName: 'Batches',
		name: 'batches',
		type: 'json',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['batchUpsert'],
			},
		},
		description: 'JSON array of batches containing catalog objects to create or update',
		placeholder:
			'[{"objects": [{"type": "ITEM", "id": "#item1", "item_data": {"name": "Product Name"}}]}]',
	},

	// ----------------------------------
	//         catalog:searchObjects
	// ----------------------------------
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'json',
		default: '',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['searchObjects'],
			},
		},
		description: 'The query filter to search catalog objects. Leave empty to return all objects.',
		placeholder: '{"text_filter": {"keywords": ["coffee"]}}',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['searchObjects'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['searchObjects'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['searchObjects'],
			},
		},
		options: [
			{
				displayName: 'Object Types',
				name: 'object_types',
				type: 'string',
				default: '',
				description: 'Comma-separated list of object types to search (e.g., ITEM,CATEGORY)',
				placeholder: 'ITEM,CATEGORY',
			},
			{
				displayName: 'Include Deleted Objects',
				name: 'include_deleted_objects',
				type: 'boolean',
				default: false,
				description: 'Whether to include deleted objects in the response',
			},
			{
				displayName: 'Include Related Objects',
				name: 'include_related_objects',
				type: 'boolean',
				default: false,
				description: 'Whether to include additional objects referenced by these objects',
			},
		],
	},

	// ----------------------------------
	//         catalog:searchItems
	// ----------------------------------
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'json',
		default: '',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['searchItems'],
			},
		},
		description: 'The query filter to search catalog items. Leave empty to return all items.',
		placeholder: '{"text_filter": {"keywords": ["coffee"]}}',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['searchItems'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['searchItems'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['searchItems'],
			},
		},
		options: [
			{
				displayName: 'Category IDs',
				name: 'category_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of category IDs to filter items',
				placeholder: 'CAT123,CAT456',
			},
			{
				displayName: 'Stock Levels',
				name: 'stock_levels',
				type: 'string',
				default: '',
				description: 'Comma-separated list of stock levels (OUT,LOW)',
				placeholder: 'OUT,LOW',
			},
			{
				displayName: 'Enabled Location IDs',
				name: 'enabled_location_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of location IDs where items are enabled',
				placeholder: 'LOC123,LOC456',
			},
			{
				displayName: 'Product Types',
				name: 'product_types',
				type: 'string',
				default: '',
				description: 'Comma-separated list of product types (REGULAR,APPOINTMENTS_SERVICE)',
				placeholder: 'REGULAR,APPOINTMENTS_SERVICE',
			},
			{
				displayName: 'Custom Attribute Filters',
				name: 'custom_attribute_filters',
				type: 'json',
				default: '',
				description: 'JSON array of custom attribute filters',
				placeholder: '[{"custom_attribute_definition_id": "ATTR_ID", "string_filter": "value"}]',
			},
		],
	},

	// ----------------------------------
	//         catalog:updateItemModifierLists
	// ----------------------------------
	{
		displayName: 'Item IDs',
		name: 'itemIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['updateItemModifierLists'],
			},
		},
		description: 'Comma-separated list of catalog item IDs to update',
		placeholder: 'ITEM123,ITEM456',
	},
	{
		displayName: 'Modifier Lists to Enable',
		name: 'modifierListsToEnable',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['updateItemModifierLists'],
			},
		},
		description: 'Comma-separated list of modifier list IDs to enable for the items',
		placeholder: 'MOD123,MOD456',
	},
	{
		displayName: 'Modifier Lists to Disable',
		name: 'modifierListsToDisable',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['catalog'],
				operation: ['updateItemModifierLists'],
			},
		},
		description: 'Comma-separated list of modifier list IDs to disable for the items',
		placeholder: 'MOD789,MOD012',
	},
];
