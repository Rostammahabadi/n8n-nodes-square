import type { INodeProperties } from 'n8n-workflow';

export const ordersOperations: INodeProperties[] = [
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
				description: 'Retrieves a set of orders by their IDs',
				action: 'Batch retrieve orders',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new order',
				action: 'Create an order',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an order by ID',
				action: 'Get an order',
			},
			{
				name: 'Pay',
				value: 'pay',
				description: 'Pay for an order using approved payments',
				action: 'Pay for an order',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search all orders for one or more locations',
				action: 'Search orders',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an open order',
				action: 'Update an order',
			},
		],
		displayOptions: {
			show: {
				resource: ['order'],
			},
		},
	},
];

export const ordersFields: INodeProperties[] = [
	// ----------------------------------
	//         order:create
	// ----------------------------------
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		description: 'The ID of the location to associate with the order',
	},
	{
		displayName: 'Order Details (JSON)',
		name: 'orderDetails',
		type: 'json',
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		description:
			'The order details as JSON. Can include line_items, taxes, discounts, service_charges, etc.',
		placeholder:
			'{"line_items": [{"name": "Item Name", "quantity": "1", "base_price_money": {"amount": 1000, "currency": "USD"}}]}',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Idempotency Key',
				name: 'idempotency_key',
				type: 'string',
				default: '={{$runIndex}}',
				description: 'A unique key to ensure this operation is only applied once',
			},
			{
				displayName: 'Customer ID',
				name: 'customer_id',
				type: 'string',
				default: '',
				description: 'The ID of the customer associated with the order',
			},
			{
				displayName: 'Reference ID',
				name: 'reference_id',
				type: 'string',
				default: '',
				description: 'A client-specified ID to associate with the order',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'options',
				default: 'OPEN',
				options: [
					{
						name: 'Open',
						value: 'OPEN',
					},
					{
						name: 'Completed',
						value: 'COMPLETED',
					},
					{
						name: 'Canceled',
						value: 'CANCELED',
					},
					{
						name: 'Draft',
						value: 'DRAFT',
					},
				],
				description: 'The state of the order',
			},
		],
	},

	// ----------------------------------
	//         order:get
	// ----------------------------------
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['get', 'update', 'pay'],
			},
		},
		description: 'The ID of the order to retrieve, update, or pay',
	},

	// ----------------------------------
	//         order:batchRetrieve
	// ----------------------------------
	{
		displayName: 'Order IDs',
		name: 'orderIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['batchRetrieve'],
			},
		},
		description: 'Comma-separated list of order IDs to retrieve',
		placeholder: 'ORDER123,ORDER456,ORDER789',
	},
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['batchRetrieve'],
			},
		},
		description: 'The ID of the location associated with the orders',
	},

	// ----------------------------------
	//         order:search
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['search'],
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
				resource: ['order'],
				operation: ['search'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Search Filters',
		name: 'searchFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Customer IDs',
				name: 'customer_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of customer IDs to filter orders',
				placeholder: 'CUST123,CUST456',
			},
			{
				displayName: 'Date Time Filter (JSON)',
				name: 'date_time_filter',
				type: 'json',
				default: '',
				description: 'Filter orders by date/time range',
				placeholder:
					'{"created_at": {"start_at": "2024-01-01T00:00:00Z", "end_at": "2024-12-31T23:59:59Z"}}',
			},
			{
				displayName: 'Fulfillment Filter',
				name: 'fulfillment_filter',
				type: 'json',
				default: '',
				description: 'Filter orders by fulfillment details',
				placeholder: '{"fulfillment_types": ["PICKUP", "SHIPMENT"]}',
			},
			{
				displayName: 'Location IDs',
				name: 'location_ids',
				type: 'string',
				default: '',
				description: 'Comma-separated list of location IDs to filter orders',
				placeholder: 'LOC123,LOC456',
			},
			{
				displayName: 'Source Filter',
				name: 'source_filter',
				type: 'json',
				default: '',
				description: 'Filter orders by source',
				placeholder: '{"source_names": ["Online Store"]}',
			},
			{
				displayName: 'State Filter',
				name: 'state_filter',
				type: 'multiOptions',
				default: [],
				options: [
					{
						name: 'Open',
						value: 'OPEN',
					},
					{
						name: 'Completed',
						value: 'COMPLETED',
					},
					{
						name: 'Canceled',
						value: 'CANCELED',
					},
					{
						name: 'Draft',
						value: 'DRAFT',
					},
				],
				description: 'Filter orders by state',
			},
		],
	},
	{
		displayName: 'Sort',
		name: 'sort',
		type: 'collection',
		placeholder: 'Add Sort',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Sort Field',
				name: 'sort_field',
				type: 'options',
				default: 'CREATED_AT',
				options: [
					{
						name: 'Created At',
						value: 'CREATED_AT',
					},
					{
						name: 'Updated At',
						value: 'UPDATED_AT',
					},
					{
						name: 'Closed At',
						value: 'CLOSED_AT',
					},
				],
				description: 'The field to sort results by',
			},
			{
				displayName: 'Sort Order',
				name: 'sort_order',
				type: 'options',
				default: 'DESC',
				options: [
					{
						name: 'Ascending',
						value: 'ASC',
					},
					{
						name: 'Descending',
						value: 'DESC',
					},
				],
				description: 'The order to sort results',
			},
		],
	},

	// ----------------------------------
	//         order:update
	// ----------------------------------
	{
		displayName: 'Order Updates (JSON)',
		name: 'orderUpdates',
		type: 'json',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['update'],
			},
		},
		description: 'The order updates as JSON. Use field_to_clear to remove fields.',
		placeholder: '{"fields_to_clear": ["taxes"], "order": {"version": 1, "line_items": [...]}}',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Idempotency Key',
				name: 'idempotency_key',
				type: 'string',
				default: '={{$runIndex}}',
				description: 'A unique key to ensure this update is only applied once',
			},
		],
	},

	// ----------------------------------
	//         order:pay
	// ----------------------------------
	{
		displayName: 'Payment IDs',
		name: 'paymentIds',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['pay'],
			},
		},
		description: 'Comma-separated list of approved payment IDs to use for this order',
		placeholder: 'PAY123,PAY456',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['order'],
				operation: ['pay'],
			},
		},
		options: [
			{
				displayName: 'Idempotency Key',
				name: 'idempotency_key',
				type: 'string',
				default: '={{$runIndex}}',
				description: 'A unique key to ensure this payment is only applied once',
			},
			{
				displayName: 'Order Version',
				name: 'order_version',
				type: 'number',
				default: 0,
				description: 'The version of the order being paid',
			},
		],
	},
];
