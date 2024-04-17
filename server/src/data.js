const { isAdmin } = require("./middlewares/auth");

const data = {
    users: [
        {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            phone: "123-456-7890",
            address: "123 Main Street, Cityville, State, 12345",
            image: 'default.png'

        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            password: "password456",
            phone: "987-654-3210",
            address: "456 Elm Street, Townsville, State, 54321",
            image: 'default.png'
        },
        {
            name: "Ridwan Mahmoud",
            email: "karimrahman6251@gmail.com",
            password: "123456",
            phone: "111-222-3333",
            address: "789 Oak Street, Villagetown, State, 98765",
            image: 'default.png',
            isAdmin: true
        },
        // {
        //     name: "Bob Brown",
        //     email: "bob@example.com",
        //     password: "passwordabc",
        //     phone: "444-555-6666",
        //     address: "321 Maple Street, Hamletville, State, 45678",
        // },
        // {
        //     name: "Eve White",
        //     email: "eve@example.com",
        //     password: "passwordefg",
        //     phone: "777-888-9999",
        //     address: "555 Pine Street, Countryside, State, 65432",
        // },
        // {
        //     name: "Charlie Green",
        //     email: "charlie@example.com",
        //     password: "passwordxyz",
        //     phone: "222-333-4444",
        //     address: "888 Birch Street, Hillside, State, 23456",
        // },
        // {
        //     name: "Grace Lee",
        //     email: "grace@example.com",
        //     password: "password123",
        //     phone: "999-888-7777",
        //     address: "777 Cedar Street, Riverside, State, 87654",
        // },
        // {
        //     name: "Daniel Taylor",
        //     email: "daniel@example.com",
        //     password: "password456",
        //     phone: "333-444-5555",
        //     address: "444 Walnut Street, Lakeside, State, 34567",
        // },
    ],
    products: [
        {
            name: "Smartphone X",
            slug: "smartphone-x",
            category: "661cc29c0851f1e2f589e9e9",
            description: "A powerful smartphone with advanced features.",
            price: 800,
            image: "smartphone_x.jpg",
            sold: 100,
            quantity: 50,
            shipping: "free"
        },
        {
            name: "Laptop Pro",
            slug: "laptop-pro",
            category: "661cc2a80851f1e2f589e9eb",
            description: "A high-performance laptop for work and entertainment.",
            price: 1200,
            image: "laptop_pro.jpg",
            sold: 50,
            quantity: 30,
            shipping: "20"
        },
        {
            name: "Ultra HD Smart TV",
            slug: "ultra-hd-smart-tv",
            category: "661cc2940851f1e2f589e9e7",
            description: "Experience stunning visuals with this Ultra HD smart TV.",
            price: 1500,
            image: "smart_tv.jpg",
            sold: 80,
            quantity: 20,
            shipping: "30"
        },
        {
            name: "Mobile Plus",
            slug: "mobile-plus",
            category: "661cc29c0851f1e2f589e9e9",
            description: "A sleek and stylish smartphone with a large display.",
            price: 700,
            image: "mobile_plus.jpg",
            sold: 120,
            quantity: 60,
            shipping: "free"
        },
        {
            name: "Laptop Air",
            slug: "laptop-air",
            category: "661cc2a80851f1e2f589e9eb",
            description: "An ultra-lightweight laptop perfect for travel.",
            price: 1000,
            image: "laptop_air.jpg",
            sold: 70,
            quantity: 40,
            shipping: "15"
        },
        {
            name: "4K Smart TV",
            slug: "4k-smart-tv",
            category: "661cc2940851f1e2f589e9e7",
            description: "Enjoy crystal-clear picture quality with this 4K smart TV.",
            price: 1300,
            image: "4k_smart_tv.jpg",
            sold: 90,
            quantity: 25,
            shipping: "25"
        }
    ]
};


module.exports = data