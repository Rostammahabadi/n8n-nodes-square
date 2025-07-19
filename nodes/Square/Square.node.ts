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
            name: 'Customer',
            value: 'customer',
          },
          {
            name: 'Invoice',
            value: 'invoice',
          },
        ],
        default: 'customer',
      },
      ...bookingsOperations,
      ...bookingsFields,
      ...customerOperations,
      ...customerFields,
      ...invoiceOperations,
      ...invoiceFields,
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

            responseData = await squareApiRequest.call(
              this,
              'PUT',
              `/bookings/${bookingId}`,
              body,
            );
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
