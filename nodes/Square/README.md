# Square

## Prerequisites

You need a Square developer account to use this node. Here's how to get started:

1. Visit [Square Developer Portal](https://developer.squareup.com/us/en)
2. Click "Sign Up" in the top right corner
3. Fill out the registration form to create your account
4. Verify your email address

## Getting Your API Credentials

1. Log into the [Square Developer Dashboard](https://developer.squareup.com/apps)
2. In the left navigation menu, click "Applications"
3. Create a new application or select an existing one
4. Navigate to the "OAuth" section in the left menu
5. Here you will find your:
   - Application ID
   - Application Secret
   - OAuth Redirect URL

## Implemented Resources

### Booking Operations

- Create a booking
- Get a booking by ID
- Get all bookings
- Update booking details
- Cancel a booking
- Search availability
- Get business booking profile
- Get location booking profile(s)
- Get team member booking profile(s)

### Catalog Operations

- Get a catalog object by ID
- List all catalog objects
- Batch retrieve catalog objects
- Batch upsert catalog objects (create/update up to 10,000 objects)
- Get catalog info
- Search catalog objects
- Search catalog items
- Update item modifier lists

### Customer Operations

- Create a customer
- Get a customer by ID
- Get all customers
- Update customer details
- Delete a customer
- Search customers

### Invoice Operations

- Create an invoice
- Get an invoice by ID
- Get all invoices
- Update invoice details
- Delete an invoice
- Search invoices

### Order Operations

- Create an order
- Get an order by ID
- Batch retrieve orders
- Search orders with advanced filters
- Update an open order
- Pay for an order

## Using OAuth with Square

To authenticate your application:

1. Use the Application ID and Application Secret in your node configuration
2. Set your OAuth Redirect URL in the Square Developer Dashboard
3. Make sure the redirect URL matches the one configured in your n8n installation

## Environment Support

The node supports both:

- Production environment (`https://connect.squareup.com/v2`)
- Sandbox environment (`https://connect.squareupsandbox.com/v2`)

## Important Notes

- Keep your Application Secret secure and never share it
- Square provides both sandbox and production environments
- The sandbox environment is great for testing without affecting real data
- Make sure to use the appropriate credentials based on your environment (sandbox/production)
- All API requests are authenticated using OAuth 2.0
- The node handles pagination automatically for list operations
- Search operations support filtering by various fields including location IDs and customer IDs

## Error Handling

The node includes comprehensive error handling for:

- Invalid credentials
- Resource not found errors
- Invalid request parameters
- API rate limiting
- Network connectivity issues

## References

- [Square Developer Documentation](https://developer.squareup.com/docs)
- [Square API Reference](https://developer.squareup.com/reference/square)
- [OAuth Documentation](https://developer.squareup.com/docs/oauth-api/overview)
