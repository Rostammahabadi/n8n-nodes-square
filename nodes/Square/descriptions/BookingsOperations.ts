import type { INodeProperties } from 'n8n-workflow';

export const bookingsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'get',
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a booking',
				action: 'Cancel a booking',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a booking',
				action: 'Create a booking',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a booking',
				action: 'Get a booking',
			},
			{
				name: 'Get Business Profile',
				value: 'getBusinessProfile',
				description: 'Get business booking profile',
				action: 'Get business booking profile',
			},
			{
				name: 'Get Location Profile',
				value: 'getLocationProfile',
				description: 'Get location booking profile',
				action: 'Get location booking profile',
			},
			{
				name: 'Get Location Profiles',
				value: 'getLocationProfiles',
				description: 'Get all location booking profiles',
				action: 'Get all location booking profiles',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get many bookings',
				action: 'Get many bookings',
			},
			{
				name: 'Get Team Member Profile',
				value: 'getTeamMemberProfile',
				description: 'Get team member booking profile',
				action: 'Get team member booking profile',
			},
			{
				name: 'Get Team Member Profiles',
				value: 'getTeamMemberProfiles',
				description: 'Get team member booking profiles',
				action: 'Get team member booking profiles',
			},
			{
				name: 'Search Availability',
				value: 'searchAvailability',
				description: 'Search for available booking slots',
				action: 'Search for available booking slots',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a booking',
				action: 'Update a booking',
			},
		],
		displayOptions: {
			show: {
				resource: ['booking'],
			},
		},
	},
];

export const bookingsFields: INodeProperties[] = [
	// ----------------------------------
	//         booking:create
	// ----------------------------------
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['create'],
			},
		},
		description: 'The ID of the location where the booking will take place',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Appointment Segments',
				name: 'appointmentSegments',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Appointment Segment',
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						displayName: 'Segment',
						name: 'segment',
						values: [
							{
								displayName: 'Duration Minutes',
								name: 'durationMinutes',
								type: 'number',
								default: 60,
								description: 'The duration of the appointment segment in minutes',
							},
							{
								displayName: 'Service Variation ID',
								name: 'serviceVariationId',
								type: 'string',
								default: '',
								description: 'The ID of the service variation for this segment',
							},
							{
								displayName: 'Team Member ID',
								name: 'teamMemberId',
								type: 'string',
								default: '',
								description: 'The ID of the team member performing the service',
							},
						],
					},
				],
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				description: 'The ID of the customer making the booking',
			},
			{
				displayName: 'Customer Note',
				name: 'customerNote',
				type: 'string',
				default: '',
				description: 'A note from the customer about the booking',
			},
			{
				displayName: 'Seller Note',
				name: 'sellerNote',
				type: 'string',
				default: '',
				description: 'A note from the seller about the booking',
			},
			{
				displayName: 'Start At',
				name: 'startAt',
				type: 'dateTime',
				default: '',
				description: 'The start time of the booking in RFC 3339 format',
			},
		],
	},

	// ----------------------------------
	//         booking:get
	// ----------------------------------
	{
		displayName: 'Booking ID',
		name: 'bookingId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['get', 'update', 'cancel'],
			},
		},
		description: 'The ID of the booking to retrieve, update, or cancel',
	},

	// ----------------------------------
	//         booking:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['getAll'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
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
				resource: ['booking'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				description: 'Filter bookings by customer ID',
			},
			{
				displayName: 'Location ID',
				name: 'locationId',
				type: 'string',
				default: '',
				description: 'Filter bookings by location ID',
			},
			{
				displayName: 'Start At Max',
				name: 'startAtMax',
				type: 'dateTime',
				default: '',
				description: 'Filter bookings starting before this time',
			},
			{
				displayName: 'Start At Min',
				name: 'startAtMin',
				type: 'dateTime',
				default: '',
				description: 'Filter bookings starting after this time',
			},
			{
				displayName: 'Team Member ID',
				name: 'teamMemberId',
				type: 'string',
				default: '',
				description: 'Filter bookings by team member ID',
			},
		],
	},

	// ----------------------------------
	//         booking:update
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Customer Note',
				name: 'customerNote',
				type: 'string',
				default: '',
				description: 'A note from the customer about the booking',
			},
			{
				displayName: 'Seller Note',
				name: 'sellerNote',
				type: 'string',
				default: '',
				description: 'A note from the seller about the booking',
			},
			{
				displayName: 'Start At',
				name: 'startAt',
				type: 'dateTime',
				default: '',
				description: 'The new start time of the booking in RFC 3339 format',
			},
		],
	},

	// ----------------------------------
	//         booking:cancel
	// ----------------------------------
	{
		displayName: 'Cancellation Reason',
		name: 'cancellationReason',
		type: 'options',
		default: 'CUSTOMER_REQUESTED',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['cancel'],
			},
		},
		options: [
			{
				name: 'Customer Requested',
				value: 'CUSTOMER_REQUESTED',
			},
			{
				name: 'Seller Requested',
				value: 'SELLER_REQUESTED',
			},
			{
				name: 'Customer No Show',
				value: 'CUSTOMER_NO_SHOW',
			},
		],
		description: 'The reason for cancelling the booking',
	},

	// ----------------------------------
	//         booking:searchAvailability
	// ----------------------------------
	{
		displayName: 'Query',
		name: 'query',
		type: 'collection',
		placeholder: 'Add Query Parameter',
		default: {},
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['searchAvailability'],
			},
		},
		options: [
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'fixedCollection',
				default: {},
				placeholder: 'Add Filter',
				options: [
					{
						displayName: 'Filter Details',
						name: 'details',
						values: [
							{
								displayName: 'Start At Range',
								name: 'startAtRange',
								type: 'fixedCollection',
								default: {},
								placeholder: 'Add Time Range',
								options: [
									{
										displayName: 'Range',
										name: 'range',
										values: [
											{
												displayName: 'Start At',
												name: 'startAt',
												type: 'dateTime',
												default: '',
												description: 'The start of the time range',
											},
											{
												displayName: 'End At',
												name: 'endAt',
												type: 'dateTime',
												default: '',
												description: 'The end of the time range',
											},
										],
									},
								],
							},
							{
								displayName: 'Location ID',
								name: 'locationId',
								type: 'string',
								default: '',
								description: 'The ID of the location to search',
							},
							{
								displayName: 'Segment Filters',
								name: 'segmentFilters',
								type: 'fixedCollection',
								default: {},
								placeholder: 'Add Segment Filter',
								typeOptions: {
									multipleValues: true,
								},
								options: [
									{
										displayName: 'Filter',
										name: 'filter',
										values: [
											{
												displayName: 'Service Variation ID',
												name: 'serviceVariationId',
												type: 'string',
												default: '',
												description: 'The ID of the service variation',
											},
											{
												displayName: 'Team Member ID Filter',
												name: 'teamMemberIdFilter',
												type: 'fixedCollection',
												default: {},
												placeholder: 'Add Team Member Filter',
												options: [
													{
														displayName: 'Filter Details',
														name: 'details',
														values: [
															{
																displayName: 'All',
																name: 'all',
																type: 'multiOptions',
																default: [],
																options: [],
																description: 'All team member IDs to include',
															},
														],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	},

	// ----------------------------------
	//         booking:getLocationProfile
	// ----------------------------------
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['getLocationProfile'],
			},
		},
		description: 'The ID of the location to get the booking profile for',
	},

	// ----------------------------------
	//         booking:getTeamMemberProfile
	// ----------------------------------
	{
		displayName: 'Team Member ID',
		name: 'teamMemberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['getTeamMemberProfile'],
			},
		},
		description: 'The ID of the team member to get the booking profile for',
	},

	// ----------------------------------
	//         booking:getTeamMemberProfiles
	// ----------------------------------
	{
		displayName: 'Bookable Only',
		name: 'bookableOnly',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['getTeamMemberProfiles'],
			},
		},
		description: 'Whether to return only bookable team members',
	},
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['booking'],
				operation: ['getTeamMemberProfiles'],
			},
		},
		description: 'Filter team member profiles by location ID',
	},
];
