# VortexCart - Modern E-Commerce Frontend

VortexCart is a modern e-commerce frontend built with Next.js, TypeScript, and Tailwind CSS. The application provides a comprehensive shopping experience with product listings, filtering, cart functionality, and checkout flow.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Product Catalog**: Browse products with filtering by category
- **Product Details**: View detailed product information
- **Shopping Cart**: Add, remove, and update quantities of products
- **Checkout Process**: Multi-step checkout with shipping, payment, and order review
- **State Management**: Cart state persists between sessions using Zustand

## Technologies Used

- **Next.js 14**: React framework for server-side rendering and static site generation
- **TypeScript**: Type safety for JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Icons**: Comprehensive icon library

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/vortex-cart.git
cd vortex-cart
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
vortex-cart/
├── public/              # Static files
├── src/
│   ├── app/             # App router pages
│   │   ├── cart/        # Cart page
│   │   ├── checkout/    # Checkout pages
│   │   ├── products/    # Product pages
│   │   ├── auth/        # Authentication pages
│   │   └── profile/     # User profile pages
│   ├── components/      # React components
│   │   ├── cart/        # Cart related components
│   │   ├── layout/      # Layout components (Navbar, Footer, etc.)
│   │   ├── product/     # Product related components
│   │   └── ui/          # UI components (Button, Banner, etc.)
│   ├── data/            # Mock data for products
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── store/           # State management (Zustand stores)
├── .gitignore           # Git ignore file
├── package.json         # Package configuration
├── README.md            # Project documentation
└── tsconfig.json        # TypeScript configuration
```

## Available Routes

- `/` - Home page
- `/products` - Product listing page
- `/products/[id]` - Product detail page
- `/cart` - Shopping cart page
- `/checkout` - Checkout page
- `/checkout/success` - Order confirmation page

## Future Enhancements

- User authentication
- Wishlist functionality
- Product reviews and ratings
- Admin dashboard
- Payment integration with Stripe
- Order history and tracking
- Search functionality
- Related products recommendations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Product data from [Fake Store API](https://fakestoreapi.com/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- UI inspiration from various modern e-commerce websites
