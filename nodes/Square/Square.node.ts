import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeConnectionType,
	INodeInputConfiguration,
	INodeOutputConfiguration,
} from 'n8n-workflow';

import { NodeOperationError } from 'n8n-workflow';

import { squareApiRequest, squareApiRequestAllItems } from './helpers';
import { customerOperations, customerFields } from './descriptions/CustomerOperations';
import { invoiceOperations, invoiceFields } from './descriptions/InvoiceOperations';
import { bookingsOperations, bookingsFields } from './descriptions/BookingsOperations';
import { catalogOperations, catalogFields } from './descriptions/CatalogOperations';
import { ordersOperations, ordersFields } from './descriptions/OrdersOperations';
export class Square implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Square',
		name: 'square',
		icon: 'file:Square.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume Square API',
		defaults: {
			name: 'Square',
		},
		inputs: ['main'] as Array<NodeConnectionType | INodeInputConfiguration>,
		outputs: ['main'] as Array<NodeConnectionType | INodeOutputConfiguration>,
		usableAsTool: true,
		credentials: [
			{
				name: 'squareApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL:
				'={{$credentials?.environment === "sandbox" ? "https://connect.squareupsandbox.com/v2" : "https://connect.squareup.com/v2"}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Booking',
						value: 'booking',
					},
					{
						name: 'Catalog',
						value: 'catalog',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Invoice',
						value: 'invoice',
					},
					{
						name: 'Order',
						value: 'order',
					},
				],
				default: 'customer',
			},
			...bookingsOperations,
			...bookingsFields,
			...catalogOperations,
			...catalogFields,
			...customerOperations,
			...customerFields,
			...invoiceOperations,
			...invoiceFields,
			...ordersOperations,
			...ordersFields,
		],
	};

	methods = {
		loadOptions: {
			// Add any dynamic option loading methods here
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let responseData;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'booking') {
					// *********************************************************************
					//                             booking
					// *********************************************************************

					if (operation === 'create') {
						// ----------------------------------
						//         booking: create
						// ----------------------------------

						const body: IDataObject = {
							location_id: this.getNodeParameter('locationId', i),
						};

						const additionalFields = this.getNodeParameter('additionalFields', i);
						Object.assign(body, additionalFields);

						responseData = await squareApiRequest.call(this, 'POST', '/bookings', body);
					} else if (operation === 'get') {
						// ----------------------------------
						//         booking: get
						// ----------------------------------

						const bookingId = this.getNodeParameter('bookingId', i);
						responseData = await squareApiRequest.call(
							this,
							'GET',
							`/bookings/${bookingId}`,
							{},
							{},
						);
					} else if (operation === 'getAll') {
						// ----------------------------------
						//         booking: getAll
						// ----------------------------------

						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 50);
						const filters = this.getNodeParameter('filters', i, {});

						const qs: IDataObject = {};
						if (filters.locationId) qs.location_id = filters.locationId;
						if (filters.teamMemberId) qs.team_member_id = filters.teamMemberId;
						if (filters.customerId) qs.customer_id = filters.customerId;
						if (filters.startAtMin) qs.start_at_min = filters.startAtMin;
						if (filters.startAtMax) qs.start_at_max = filters.startAtMax;

						if (returnAll) {
							responseData = await squareApiRequestAllItems.call(this, 'booking', qs);
						} else {
							qs.limit = limit;
							responseData = await squareApiRequest.call(this, 'GET', '/bookings', {}, qs);
						}
					} else if (operation === 'update') {
						// ----------------------------------
						//         booking: update
						// ----------------------------------

						const bookingId = this.getNodeParameter('bookingId', i);
						const updateFields = this.getNodeParameter('updateFields', i);

						const body: IDataObject = {
							booking: updateFields,
						};

						responseData = await squareApiRequest.call(this, 'PUT', `/bookings/${bookingId}`, body);
					} else if (operation === 'cancel') {
						// ----------------------------------
						//         booking: cancel
						// ----------------------------------

						const bookingId = this.getNodeParameter('bookingId', i);
						const cancellationReason = this.getNodeParameter('cancellationReason', i);

						const body: IDataObject = {
							booking_version: 1, // This should ideally be retrieved from the booking first
							cancellation_reason: cancellationReason,
						};

						responseData = await squareApiRequest.call(
							this,
							'POST',
							`/bookings/${bookingId}/cancel`,
							body,
						);
					} else if (operation === 'searchAvailability') {
						// ----------------------------------
						//         booking: searchAvailability
						// ----------------------------------

						const query = this.getNodeParameter('query', i);

						const body: IDataObject = {
							query,
						};

						responseData = await squareApiRequest.call(
							this,
							'POST',
							'/bookings/availability/search',
							body,
						);
					} else if (operation === 'getBusinessProfile') {
						// ----------------------------------
						//         booking: getBusinessProfile
						// ----------------------------------

						responseData = await squareApiRequest.call(
							this,
							'GET',
							'/bookings/business-booking-profile',
							{},
							{},
						);
					} else if (operation === 'getLocationProfile') {
						// ----------------------------------
						//         booking: getLocationProfile
						// ----------------------------------

						const locationId = this.getNodeParameter('locationId', i);
						responseData = await squareApiRequest.call(
							this,
							'GET',
							`/bookings/location-booking-profiles/${locationId}`,
							{},
							{},
						);
					} else if (operation === 'getLocationProfiles') {
						// ----------------------------------
						//         booking: getLocationProfiles
						// ----------------------------------

						responseData = await squareApiRequest.call(
							this,
							'GET',
							'/bookings/location-booking-profiles',
							{},
							{},
						);
					} else if (operation === 'getTeamMemberProfile') {
						// ----------------------------------
						//         booking: getTeamMemberProfile
						// ----------------------------------

						const teamMemberId = this.getNodeParameter('teamMemberId', i);
						responseData = await squareApiRequest.call(
							this,
							'GET',
							`/bookings/team-member-booking-profiles/${teamMemberId}`,
							{},
							{},
						);
					} else if (operation === 'getTeamMemberProfiles') {
						// ----------------------------------
						//         booking: getTeamMemberProfiles
						// ----------------------------------

						const bookableOnly = this.getNodeParameter('bookableOnly', i, false);
						const locationId = this.getNodeParameter('locationId', i, '');

						const qs: IDataObject = {};
						if (bookableOnly) qs.bookable_only = bookableOnly;
						if (locationId) qs.location_id = locationId;

						responseData = await squareApiRequest.call(
							this,
							'GET',
							'/bookings/team-member-booking-profiles',
							{},
							qs,
						);
					}
				} else if (resource === 'catalog') {
					// *********************************************************************
					//                             catalog
					// *********************************************************************

					if (operation === 'get') {
						// ----------------------------------
						//         catalog: get
						// ----------------------------------

						const objectId = this.getNodeParameter('objectId', i);
						const additionalFields = this.getNodeParameter('additionalFields', i, {});

						const qs: IDataObject = {};
						if (additionalFields.include_related_objects) {
							qs.include_related_objects = additionalFields.include_related_objects;
						}
						if (additionalFields.catalog_version) {
							qs.catalog_version = additionalFields.catalog_version;
						}

						responseData = await squareApiRequest.call(
							this,
							'GET',
							`/catalog/object/${objectId}`,
							{},
							qs,
						);
					} else if (operation === 'list') {
						// ----------------------------------
						//         catalog: list
						// ----------------------------------

						const returnAll = this.getNodeParameter('returnAll', i);
						const filters = this.getNodeParameter('filters', i, {});

						const qs: IDataObject = {};
						if (filters.types) {
							qs.types = filters.types;
						}
						if (filters.catalog_version) {
							qs.catalog_version = filters.catalog_version;
						}

						if (returnAll) {
							const allResults: IDataObject[] = [];
							let cursor: string | undefined;

							do {
								if (cursor) {
									qs.cursor = cursor;
								}
								const response = await squareApiRequest.call(this, 'GET', '/catalog/list', {}, qs);
								allResults.push(...(response.objects || []));
								cursor = response.cursor;
							} while (cursor);

							responseData = allResults;
						} else {
							const limit = this.getNodeParameter('limit', i, 100);
							qs.limit = limit;
							const response = await squareApiRequest.call(this, 'GET', '/catalog/list', {}, qs);
							responseData = response.objects || [];
						}
					} else if (operation === 'batchRetrieve') {
						// ----------------------------------
						//         catalog: batchRetrieve
						// ----------------------------------

						const objectIds = this.getNodeParameter('objectIds', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {});

						const body: IDataObject = {
							object_ids: objectIds.split(',').map((id) => id.trim()),
						};

						if (additionalFields.include_related_objects) {
							body.include_related_objects = additionalFields.include_related_objects;
						}
						if (additionalFields.catalog_version) {
							body.catalog_version = additionalFields.catalog_version;
						}

						responseData = await squareApiRequest.call(
							this,
							'POST',
							'/catalog/batch-retrieve',
							body,
						);
					} else if (operation === 'batchUpsert') {
						// ----------------------------------
						//         catalog: batchUpsert
						// ----------------------------------

						const idempotencyKey = this.getNodeParameter('idempotencyKey', i) as string;
						const batchesJson = this.getNodeParameter('batches', i) as string;

						let batches;
						try {
							batches = JSON.parse(batchesJson);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Batches field must be valid JSON', {
								itemIndex: i,
							});
						}

						const body: IDataObject = {
							idempotency_key: idempotencyKey,
							batches,
						};

						responseData = await squareApiRequest.call(this, 'POST', '/catalog/batch-upsert', body);
					} else if (operation === 'getCatalogInfo') {
						// ----------------------------------
						//         catalog: getCatalogInfo
						// ----------------------------------

						responseData = await squareApiRequest.call(this, 'GET', '/catalog/info', {}, {});
					} else if (operation === 'searchObjects') {
						// ----------------------------------
						//         catalog: searchObjects
						// ----------------------------------

						const returnAll = this.getNodeParameter('returnAll', i);
						const searchQueryJson = this.getNodeParameter('searchQuery', i, '') as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {});

						let query;
						if (searchQueryJson) {
							try {
								query = JSON.parse(searchQueryJson);
							} catch (error) {
								throw new NodeOperationError(
									this.getNode(),
									'Search Query field must be valid JSON',
									{ itemIndex: i },
								);
							}
						}

						const body: IDataObject = {};
						if (query) {
							body.query = query;
						}
						if (additionalFields.object_types) {
							body.object_types = (additionalFields.object_types as string)
								.split(',')
								.map((type) => type.trim());
						}
						if (additionalFields.include_deleted_objects) {
							body.include_deleted_objects = additionalFields.include_deleted_objects;
						}
						if (additionalFields.include_related_objects) {
							body.include_related_objects = additionalFields.include_related_objects;
						}

						if (returnAll) {
							const allResults: IDataObject[] = [];
							let cursor: string | undefined;

							do {
								if (cursor) {
									body.cursor = cursor;
								}
								const response = await squareApiRequest.call(this, 'POST', '/catalog/search', body);
								allResults.push(...(response.objects || []));
								cursor = response.cursor;
							} while (cursor);

							responseData = allResults;
						} else {
							const limit = this.getNodeParameter('limit', i, 100);
							body.limit = limit;
							const response = await squareApiRequest.call(this, 'POST', '/catalog/search', body);
							responseData = response.objects || [];
						}
					} else if (operation === 'searchItems') {
						// ----------------------------------
						//         catalog: searchItems
						// ----------------------------------

						const returnAll = this.getNodeParameter('returnAll', i);
						const searchQueryJson = this.getNodeParameter('searchQuery', i, '') as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {});

						let query;
						if (searchQueryJson) {
							try {
								query = JSON.parse(searchQueryJson);
							} catch (error) {
								throw new NodeOperationError(
									this.getNode(),
									'Search Query field must be valid JSON',
									{ itemIndex: i },
								);
							}
						}

						const body: IDataObject = {};
						if (query) {
							body.query = query;
						}
						if (additionalFields.category_ids) {
							body.category_ids = (additionalFields.category_ids as string)
								.split(',')
								.map((id) => id.trim());
						}
						if (additionalFields.stock_levels) {
							body.stock_levels = (additionalFields.stock_levels as string)
								.split(',')
								.map((level) => level.trim());
						}
						if (additionalFields.enabled_location_ids) {
							body.enabled_location_ids = (additionalFields.enabled_location_ids as string)
								.split(',')
								.map((id) => id.trim());
						}
						if (additionalFields.product_types) {
							body.product_types = (additionalFields.product_types as string)
								.split(',')
								.map((type) => type.trim());
						}
						if (additionalFields.custom_attribute_filters) {
							try {
								body.custom_attribute_filters = JSON.parse(
									additionalFields.custom_attribute_filters as string,
								);
							} catch (error) {
								throw new NodeOperationError(
									this.getNode(),
									'Custom Attribute Filters must be valid JSON',
									{ itemIndex: i },
								);
							}
						}

						if (returnAll) {
							const allResults: IDataObject[] = [];
							let cursor: string | undefined;

							do {
								if (cursor) {
									body.cursor = cursor;
								}
								const response = await squareApiRequest.call(
									this,
									'POST',
									'/catalog/search-catalog-items',
									body,
								);
								allResults.push(...(response.items || []));
								cursor = response.cursor;
							} while (cursor);

							responseData = allResults;
						} else {
							const limit = this.getNodeParameter('limit', i, 100);
							body.limit = limit;
							const response = await squareApiRequest.call(
								this,
								'POST',
								'/catalog/search-catalog-items',
								body,
							);
							responseData = response.items || [];
						}
					} else if (operation === 'updateItemModifierLists') {
						// ----------------------------------
						//         catalog: updateItemModifierLists
						// ----------------------------------

						const itemIds = this.getNodeParameter('itemIds', i) as string;
						const modifierListsToEnable = this.getNodeParameter(
							'modifierListsToEnable',
							i,
							'',
						) as string;
						const modifierListsToDisable = this.getNodeParameter(
							'modifierListsToDisable',
							i,
							'',
						) as string;

						const body: IDataObject = {
							item_ids: itemIds.split(',').map((id) => id.trim()),
						};

						if (modifierListsToEnable) {
							body.modifier_lists_to_enable = modifierListsToEnable
								.split(',')
								.map((id) => id.trim());
						}
						if (modifierListsToDisable) {
							body.modifier_lists_to_disable = modifierListsToDisable
								.split(',')
								.map((id) => id.trim());
						}

						responseData = await squareApiRequest.call(
							this,
							'POST',
							'/catalog/update-item-modifier-lists',
							body,
						);
					}
				} else if (resource === 'customer') {
					// *********************************************************************
					//                             customer
					// *********************************************************************

					if (operation === 'create') {
						// ----------------------------------
						//         customer: create
						// ----------------------------------

						const body: IDataObject = {
							given_name: this.getNodeParameter('given_name', i),
						};

						const additionalFields = this.getNodeParameter('additionalFields', i);
						Object.assign(body, additionalFields);

						responseData = await squareApiRequest.call(this, 'POST', '/customers', body);
					} else if (operation === 'get') {
						// ----------------------------------
						//         customer: get
						// ----------------------------------

						const customerId = this.getNodeParameter('customerId', i);
						responseData = await squareApiRequest.call(
							this,
							'GET',
							`/customers/${customerId}`,
							{},
							{},
						);
						if (responseData.error) {
							if (this.continueOnFail()) {
								const executionErrorData = this.helpers.constructExecutionMetaData(
									this.helpers.returnJsonArray({ error: responseData.error.message }),
									{ itemData: { item: i } },
								);
								returnData.push(...executionErrorData);
								continue;
							}
							throw new NodeOperationError(this.getNode(), responseData.error.message, {
								itemIndex: i,
							});
						}
					} else if (operation === 'getAll') {
						// ----------------------------------
						//         customer: getAll
						// ----------------------------------

						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100);

						if (returnAll) {
							responseData = await squareApiRequestAllItems.call(this, '/customers');
						} else {
							const qs = {
								limit,
							};
							responseData = await squareApiRequest.call(this, 'GET', '/customers', {}, qs);
						}
					} else if (operation === 'update') {
						// ----------------------------------
						//         customer: update
						// ----------------------------------

						const customerId = this.getNodeParameter('customerId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						if (Object.keys(updateFields).length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'Please enter at least one field to update for the customer',
								{ itemIndex: i },
							);
						}

						responseData = await squareApiRequest.call(
							this,
							'PUT',
							`/customers/${customerId}`,
							updateFields,
						);
					} else if (operation === 'delete') {
						// ----------------------------------
						//         customer: delete
						// ----------------------------------

						const customerId = this.getNodeParameter('customerId', i);
						responseData = await squareApiRequest.call(
							this,
							'DELETE',
							`/customers/${customerId}`,
							{},
							{},
						);
					} else if (operation === 'search') {
						// ----------------------------------
						//         customer: search
						// ----------------------------------

						const returnAll = this.getNodeParameter('returnAll', i);
						const searchFields = this.getNodeParameter('searchFields', i) as IDataObject;
						const body: {
							query: { filter: { location_ids?: string[]; customer_ids?: string[] } };
							limit?: number;
						} = {
							query: {
								filter: {
									location_ids: searchFields?.location_ids
										? (searchFields.location_ids as string).split(',')
										: undefined,
									customer_ids: searchFields?.customer_ids
										? (searchFields.customer_ids as string).split(',')
										: undefined,
								},
							},
						};

						if (returnAll) {
							responseData = await squareApiRequestAllItems.call(this, '/customers/search', body);
						} else {
							const limit = this.getNodeParameter('limit', i, 100);
							body.limit = limit as number;
							responseData = await squareApiRequest.call(this, 'POST', '/customers/search', body);
						}
					}
				} else if (resource === 'invoice') {
					// *********************************************************************
					//                             invoice
					// *********************************************************************

					if (operation === 'create') {
						// ----------------------------------
						//         invoice: create
						// ----------------------------------

						const body: IDataObject = {
							location_id: this.getNodeParameter('location_id', i),
						};

						const additionalFields = this.getNodeParameter('additionalFields', i);
						Object.assign(body, additionalFields);

						responseData = await squareApiRequest.call(this, 'POST', '/invoices', body);
					} else if (operation === 'get') {
						// ----------------------------------
						//         invoice: get
						// ----------------------------------

						const invoiceId = this.getNodeParameter('invoiceId', i);
						responseData = await squareApiRequest.call(
							this,
							'GET',
							`/invoices/${invoiceId}`,
							{},
							{},
						);
					} else if (operation === 'getAll') {
						// ----------------------------------
						//         invoice: getAll
						// ----------------------------------

						const returnAll = this.getNodeParameter('returnAll', i);
						const limit = this.getNodeParameter('limit', i, 100);

						if (returnAll) {
							responseData = await squareApiRequestAllItems.call(this, '/invoices');
						} else {
							const qs = {
								limit,
							};
							responseData = await squareApiRequest.call(this, 'GET', '/invoices', {}, qs);
						}
					} else if (operation === 'update') {
						// ----------------------------------
						//         invoice: update
						// ----------------------------------

						const invoiceId = this.getNodeParameter('invoiceId', i);
						const version = this.getNodeParameter('version', i);
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						if (Object.keys(updateFields).length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'Please enter at least one field to update for the invoice',
								{ itemIndex: i },
							);
						}

						const body = {
							invoice: {
								version,
								...updateFields,
							},
						};

						responseData = await squareApiRequest.call(this, 'PUT', `/invoices/${invoiceId}`, body);
					} else if (operation === 'delete') {
						// ----------------------------------
						//         invoice: delete
						// ----------------------------------

						const invoiceId = this.getNodeParameter('invoiceId', i);
						const version = this.getNodeParameter('version', i);

						responseData = await squareApiRequest.call(this, 'DELETE', `/invoices/${invoiceId}`, {
							version,
						});
					} else if (operation === 'search') {
						// ----------------------------------
						//         invoice: search
						// ----------------------------------

						const returnAll = this.getNodeParameter('returnAll', i);
						const searchFields = this.getNodeParameter('searchFields', i) as IDataObject;
						const body: {
							query: { filter: { location_ids?: string[]; customer_ids?: string[] } };
							limit?: number;
						} = {
							query: {
								filter: {
									location_ids: searchFields?.location_ids
										? (searchFields.location_ids as string).split(',')
										: undefined,
									customer_ids: searchFields?.customer_ids
										? (searchFields.customer_ids as string).split(',')
										: undefined,
								},
							},
						};

						if (returnAll) {
							responseData = await squareApiRequestAllItems.call(this, '/invoices/search', body);
						} else {
							const limit = this.getNodeParameter('limit', i, 100);
							body.limit = limit as number;
							responseData = await squareApiRequest.call(this, 'POST', '/invoices/search', body);
						}
					}
				} else if (resource === 'order') {
					// *********************************************************************
					//                             order
					// *********************************************************************

					if (operation === 'create') {
						// ----------------------------------
						//         order: create
						// ----------------------------------

						const locationId = this.getNodeParameter('locationId', i);
						const orderDetailsJson = this.getNodeParameter('orderDetails', i, '') as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {});

						let orderDetails;
						if (orderDetailsJson) {
							try {
								orderDetails = JSON.parse(orderDetailsJson);
							} catch (error) {
								throw new NodeOperationError(this.getNode(), 'Order Details must be valid JSON', {
									itemIndex: i,
								});
							}
						}

						const body: IDataObject = {
							order: {
								location_id: locationId,
								...orderDetails,
							},
						};

						if (additionalFields.idempotency_key) {
							body.idempotency_key = additionalFields.idempotency_key;
						} else {
							body.idempotency_key = `${Date.now()}-${i}`;
						}

						if (additionalFields.customer_id) {
							(body.order as IDataObject).customer_id = additionalFields.customer_id;
						}
						if (additionalFields.reference_id) {
							(body.order as IDataObject).reference_id = additionalFields.reference_id;
						}
						if (additionalFields.state) {
							(body.order as IDataObject).state = additionalFields.state;
						}

						responseData = await squareApiRequest.call(this, 'POST', '/orders', body);
					} else if (operation === 'get') {
						// ----------------------------------
						//         order: get
						// ----------------------------------

						const orderId = this.getNodeParameter('orderId', i);
						responseData = await squareApiRequest.call(this, 'GET', `/orders/${orderId}`, {}, {});
					} else if (operation === 'batchRetrieve') {
						// ----------------------------------
						//         order: batchRetrieve
						// ----------------------------------

						const orderIds = this.getNodeParameter('orderIds', i) as string;
						const locationId = this.getNodeParameter('locationId', i);

						const body: IDataObject = {
							location_id: locationId,
							order_ids: orderIds.split(',').map((id) => id.trim()),
						};

						responseData = await squareApiRequest.call(
							this,
							'POST',
							'/orders/batch-retrieve',
							body,
						);
					} else if (operation === 'search') {
						// ----------------------------------
						//         order: search
						// ----------------------------------

						const returnAll = this.getNodeParameter('returnAll', i);
						const searchFilters = this.getNodeParameter('searchFilters', i, {}) as IDataObject;
						const sort = this.getNodeParameter('sort', i, {}) as IDataObject;

						const body: IDataObject = {
							query: {
								filter: {},
							},
						};

						// Build filter
						const filter: IDataObject = {};
						if (searchFilters.location_ids) {
							filter.location_ids = (searchFilters.location_ids as string)
								.split(',')
								.map((id) => id.trim());
						}
						if (searchFilters.customer_ids) {
							const customerFilter: IDataObject = {
								customer_ids: (searchFilters.customer_ids as string)
									.split(',')
									.map((id) => id.trim()),
							};
							filter.customer_filter = customerFilter;
						}
						if (searchFilters.state_filter && (searchFilters.state_filter as string[]).length > 0) {
							filter.state_filter = {
								states: searchFilters.state_filter,
							};
						}
						if (searchFilters.date_time_filter) {
							try {
								filter.date_time_filter = JSON.parse(searchFilters.date_time_filter as string);
							} catch (error) {
								throw new NodeOperationError(
									this.getNode(),
									'Date Time Filter must be valid JSON',
									{ itemIndex: i },
								);
							}
						}
						if (searchFilters.fulfillment_filter) {
							try {
								filter.fulfillment_filter = JSON.parse(searchFilters.fulfillment_filter as string);
							} catch (error) {
								throw new NodeOperationError(
									this.getNode(),
									'Fulfillment Filter must be valid JSON',
									{ itemIndex: i },
								);
							}
						}
						if (searchFilters.source_filter) {
							try {
								filter.source_filter = JSON.parse(searchFilters.source_filter as string);
							} catch (error) {
								throw new NodeOperationError(this.getNode(), 'Source Filter must be valid JSON', {
									itemIndex: i,
								});
							}
						}

						(body.query as IDataObject).filter = filter;

						// Add sort
						if (sort.sort_field) {
							(body.query as IDataObject).sort = {
								sort_field: sort.sort_field,
								sort_order: sort.sort_order || 'DESC',
							};
						}

						if (returnAll) {
							const allResults: IDataObject[] = [];
							let cursor: string | undefined;

							do {
								if (cursor) {
									body.cursor = cursor;
								}
								const response = await squareApiRequest.call(this, 'POST', '/orders/search', body);
								allResults.push(...(response.orders || []));
								cursor = response.cursor;
							} while (cursor);

							responseData = allResults;
						} else {
							const limit = this.getNodeParameter('limit', i, 100);
							body.limit = limit;
							const response = await squareApiRequest.call(this, 'POST', '/orders/search', body);
							responseData = response.orders || [];
						}
					} else if (operation === 'update') {
						// ----------------------------------
						//         order: update
						// ----------------------------------

						const orderId = this.getNodeParameter('orderId', i);
						const orderUpdatesJson = this.getNodeParameter('orderUpdates', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {});

						let orderUpdates;
						try {
							orderUpdates = JSON.parse(orderUpdatesJson);
						} catch (error) {
							throw new NodeOperationError(this.getNode(), 'Order Updates must be valid JSON', {
								itemIndex: i,
							});
						}

						const body: IDataObject = {
							...orderUpdates,
						};

						if (additionalFields.idempotency_key) {
							body.idempotency_key = additionalFields.idempotency_key;
						} else {
							body.idempotency_key = `${Date.now()}-${i}`;
						}

						responseData = await squareApiRequest.call(this, 'PUT', `/orders/${orderId}`, body);
					} else if (operation === 'pay') {
						// ----------------------------------
						//         order: pay
						// ----------------------------------

						const orderId = this.getNodeParameter('orderId', i);
						const paymentIds = this.getNodeParameter('paymentIds', i, '') as string;
						const additionalFields = this.getNodeParameter('additionalFields', i, {});

						const body: IDataObject = {};

						if (additionalFields.idempotency_key) {
							body.idempotency_key = additionalFields.idempotency_key;
						} else {
							body.idempotency_key = `${Date.now()}-${i}`;
						}

						if (paymentIds) {
							body.payment_ids = paymentIds.split(',').map((id) => id.trim());
						}

						if (additionalFields.order_version) {
							body.order_version = additionalFields.order_version;
						}

						responseData = await squareApiRequest.call(
							this,
							'POST',
							`/orders/${orderId}/pay`,
							body,
						);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject[]),
				{ itemData: { item: i } },
			);

			returnData.push(...executionData);
		}

		return [returnData];
	}
}
