-- ==========================================================
-- Sobuj Enterprise - Complete SQL Database Schema & Seed Data
-- ==========================================================

-- 1. Categories Table
CREATE TABLE Categories (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(150) NOT NULL,
    Slug NVARCHAR(150) NOT NULL UNIQUE,
    Description NVARCHAR(500) NULL,
    Icon NVARCHAR(100) NULL,
    ImageUrl NVARCHAR(500) NULL,
    ParentId INT NULL FOREIGN KEY REFERENCES Categories(Id),
    IsFeatured BIT DEFAULT 0,
    DisplayOrder INT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- 2. Brands Table
CREATE TABLE Brands (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(150) NOT NULL UNIQUE,
    Slug NVARCHAR(150) NOT NULL UNIQUE,
    LogoUrl NVARCHAR(500) NULL,
    Website NVARCHAR(250) NULL,
    IsFeatured BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- 3. Filter Attributes (Admin Configurable)
CREATE TABLE FilterAttributes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,            -- e.g. "Paper Size", "GSM", "Tip Size", "Binding", "Color"
    Code NVARCHAR(50) NOT NULL UNIQUE,      -- e.g. "paper_size", "gsm", "tip_size"
    CategoryId INT NULL FOREIGN KEY REFERENCES Categories(Id), -- Optional link to specific category
    DisplayType NVARCHAR(50) DEFAULT 'Checkbox', -- Checkbox, Dropdown, ColorSwatch, Range
    DisplayOrder INT DEFAULT 0
);

CREATE TABLE FilterAttributeValues (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FilterAttributeId INT NOT NULL FOREIGN KEY REFERENCES FilterAttributes(Id) ON DELETE CASCADE,
    Value NVARCHAR(100) NOT NULL,           -- e.g. "A4", "A5", "80 GSM", "100 GSM", "0.5mm", "0.7mm"
    ColorHex NVARCHAR(20) NULL,             -- For color swatches
    DisplayOrder INT DEFAULT 0
);

-- 4. Products Table
CREATE TABLE Products (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(250) NOT NULL,
    Slug NVARCHAR(250) NOT NULL UNIQUE,
    SKU NVARCHAR(100) NOT NULL UNIQUE,
    ShortDescription NVARCHAR(500) NULL,
    Description NVARCHAR(MAX) NULL,
    Price DECIMAL(18,2) NOT NULL,
    DiscountPrice DECIMAL(18,2) NULL,
    CostPrice DECIMAL(18,2) NULL,
    StockQuantity INT NOT NULL DEFAULT 0,
    LowStockThreshold INT DEFAULT 5,
    CategoryId INT NOT NULL FOREIGN KEY REFERENCES Categories(Id),
    BrandId INT NULL FOREIGN KEY REFERENCES Brands(Id),
    PrimaryImageUrl NVARCHAR(500) NOT NULL,
    IsFeatured BIT DEFAULT 0,
    IsNewArrival BIT DEFAULT 1,
    IsBestSeller BIT DEFAULT 0,
    Rating DECIMAL(3,2) DEFAULT 5.0,
    ReviewCount INT DEFAULT 0,
    Tags NVARCHAR(300) NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL
);

-- 5. Product Images (Gallery)
CREATE TABLE ProductImages (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(Id) ON DELETE CASCADE,
    ImageUrl NVARCHAR(500) NOT NULL,
    DisplayOrder INT DEFAULT 0
);

-- 6. Product Filter Values (Mapping product to dynamic filters)
CREATE TABLE ProductFilterValues (
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(Id) ON DELETE CASCADE,
    FilterAttributeValueId INT NOT NULL FOREIGN KEY REFERENCES FilterAttributeValues(Id) ON DELETE CASCADE,
    PRIMARY KEY (ProductId, FilterAttributeValueId)
);

-- 7. Product Variants (Color, Pack size, Tip size)
CREATE TABLE ProductVariants (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(Id) ON DELETE CASCADE,
    VariantName NVARCHAR(100) NOT NULL,     -- e.g. "Pack of 10 - Blue 0.5mm"
    SKU NVARCHAR(100) NOT NULL UNIQUE,
    PriceAdjustment DECIMAL(18,2) DEFAULT 0.00,
    StockQuantity INT NOT NULL DEFAULT 0
);

-- 8. WhatsApp Message Templates (Admin Configurable)
CREATE TABLE WhatsAppTemplates (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    TemplateType NVARCHAR(100) NOT NULL UNIQUE, -- e.g. "Standard_COD", "Express_Delivery", "Corporate_Bulk"
    Title NVARCHAR(150) NOT NULL,
    MessageFormat NVARCHAR(MAX) NOT NULL,       -- Variables: {OrderId}, {CustomerName}, {CustomerPhone}, {ItemsList}, {TotalAmount}, {Address}, {City}, {Note}
    IsDefault BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- 9. Orders & Order Items
CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderNumber NVARCHAR(50) NOT NULL UNIQUE,
    CustomerName NVARCHAR(150) NOT NULL,
    CustomerPhone NVARCHAR(50) NOT NULL,
    CustomerEmail NVARCHAR(150) NULL,
    DeliveryAddress NVARCHAR(500) NOT NULL,
    City NVARCHAR(100) NOT NULL,
    Area NVARCHAR(150) NULL,
    DeliveryFee DECIMAL(18,2) NOT NULL DEFAULT 60.00,
    SubTotal DECIMAL(18,2) NOT NULL,
    TotalAmount DECIMAL(18,2) NOT NULL,
    PaymentMethod NVARCHAR(50) NOT NULL DEFAULT 'COD',
    PaymentStatus NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    OrderStatus NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    OrderType NVARCHAR(50) NOT NULL DEFAULT 'Standard_COD',
    CustomerNote NVARCHAR(500) NULL,
    AdminNote NVARCHAR(500) NULL,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL
);

CREATE TABLE OrderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(Id) ON DELETE CASCADE,
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(Id),
    ProductTitle NVARCHAR(250) NOT NULL,
    ProductSKU NVARCHAR(100) NOT NULL,
    VariantName NVARCHAR(100) NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Quantity INT NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL
);

-- 10. Users & Roles
CREATE TABLE Roles (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    PhoneNumber NVARCHAR(50) NULL,
    RoleId INT NOT NULL FOREIGN KEY REFERENCES Roles(Id),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

-- ==========================================================
-- SEED DATA
-- ==========================================================
INSERT INTO Roles (RoleName) VALUES ('Admin'), ('Customer');

INSERT INTO Categories (Name, Slug, Description, Icon, ImageUrl, IsFeatured, DisplayOrder)
VALUES 
('Office Supplies', 'office-supplies', 'Essential desk, files, staplers & office accessories', 'briefcase', 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600', 1, 1),
('Paper & Notebooks', 'paper-notebooks', 'Premium A4 papers, spiral notebooks & journals', 'book', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', 1, 2),
('Writing & Correction', 'writing-correction', 'Gel pens, ball pens, highlighters, markers & correction tapes', 'edit-3', 'https://images.unsplash.com/photo-1585336261026-418071839958?w=600', 1, 3),
('Art & Craft Supplies', 'art-craft-supplies', 'Watercolors, sketchbooks, acrylics, brushes & clay', 'palette', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600', 1, 4),
('School Essentials', 'school-essentials', 'Geometry sets, pencil boxes, crayons & lunch accessories', 'smile', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600', 1, 5),
('Desk Organization', 'desk-organization', 'Pen holders, document trays, organizers & sticky note pads', 'grid', 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=600', 1, 6);

INSERT INTO Brands (Name, Slug, LogoUrl, Website, IsFeatured)
VALUES
('Faber-Castell', 'faber-castell', 'https://cdn.worldvectorlogo.com/logos/faber-castell.svg', 'https://faber-castell.com', 1),
('Deli', 'deli', 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Deli_Company_Logo.svg', 'https://deliworld.com', 1),
('Pilot', 'pilot', 'https://cdn.worldvectorlogo.com/logos/pilot-pen.svg', 'https://pilotpen.com', 1),
('Double A', 'double-a', 'https://seeklogo.com/images/D/double-a-paper-logo-8A1901C90D-seeklogo.com.png', 'https://doubleapaper.com', 1),
('Zebra', 'zebra', 'https://cdn.worldvectorlogo.com/logos/zebra-pen.svg', 'https://zebrapen.com', 1),
('Kokuyo Camlin', 'kokuyo-camlin', 'https://seeklogo.com/images/C/camlin-logo-C78C9E91B0-seeklogo.com.png', 'https://kokuyocamlin.com', 1),
('Doms', 'doms', 'https://seeklogo.com/images/D/doms-logo-E9DCDB8FF4-seeklogo.com.png', 'https://domsindia.com', 1);

INSERT INTO WhatsAppTemplates (TemplateType, Title, MessageFormat, IsDefault)
VALUES
('Standard_COD', 'Standard Cash on Delivery Template', 
'👋 Hello Sobuj Enterprise!
I have placed an order on your website.

🛒 *Order ID:* {OrderId}
👤 *Customer:* {CustomerName}
📞 *Phone:* {CustomerPhone}
📍 *Address:* {Address}, {City}
💰 *Total Payable:* ৳{TotalAmount} (Cash on Delivery)

📦 *Items Ordered:*
{ItemsList}

📝 *Note:* {Note}

Please confirm and dispatch my order. Thank you!', 1),

('Express_Delivery', 'Urgent / Express Office Delivery', 
'🚨 *URGENT ORDER* - Sobuj Enterprise!
I urgently require these stationery supplies for office use.

⚡ *Order ID:* {OrderId}
👤 *Recipient:* {CustomerName}
📞 *Phone:* {CustomerPhone}
📍 *Delivery Location:* {Address}, {City}
💵 *Amount:* ৳{TotalAmount}

📋 *Urgent Items List:*
{ItemsList}

Please let me know when your rider can deliver this today. Thanks!', 0),

('Corporate_Bulk', 'Corporate / Bulk Stationery Inquiry', 
'🏢 *CORPORATE REQUISITION* - Sobuj Enterprise
Greetings! We have submitted a bulk order request.

📑 *Requisition No:* {OrderId}
👤 *Contact Person:* {CustomerName}
📞 *Phone:* {CustomerPhone}
🏢 *Delivery Address:* {Address}, {City}
📊 *Quotation Estimate:* ৳{TotalAmount}

📝 *Items Details:*
{ItemsList}

We request an official VAT invoice and corporate challan with this consignment. Thank you!', 0);

INSERT INTO Products (Title, Slug, SKU, ShortDescription, Description, Price, DiscountPrice, StockQuantity, CategoryId, BrandId, PrimaryImageUrl, IsFeatured, IsNewArrival, IsBestSeller, Rating, ReviewCount, Tags)
VALUES
('Double A Copier Paper A4 80 GSM (500 Sheets/Ream)', 'double-a-copier-paper-a4-80-gsm', 'PAP-DBL-A4-80', 'High quality premium smooth copy paper suitable for laser, inkjet and photocopiers.', 'Double A Paper is globally renowned for its high quality, smooth texture, bright white finish, and zero jamming reliability.', 560.00, 520.00, 150, 2, 4, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600', 1, 1, 1, 4.9, 84, 'paper,a4,double a,copier,office'),
('Pilot G2 Premium Gel Roller Pen 0.5mm (Pack of 3)', 'pilot-g2-gel-pen-0-5mm-pack-3', 'PEN-PLT-G2-05', 'Smooth gel ink formula that writes longer than other gel pens with comfortable rubber grip.', 'The Pilot G2 is America''s #1 selling gel pen. Features super smooth writing gel ink, contoured rubber grip, and refillable design.', 450.00, 420.00, 95, 3, 3, 'https://images.unsplash.com/photo-1585336261026-418071839958?w=600', 1, 1, 1, 5.0, 120, 'pen,gel pen,pilot,writing'),
('Deli Heavy Duty Desktop Stapler with 1000 Staples', 'deli-heavy-duty-desktop-stapler', 'OFF-DELI-STP-01', 'Sturdy steel mechanism stapler for 25-50 sheet capacity with ergonomic pressing handle.', 'Deli Office classic desk stapler engineered for durability. Includes standard 24/6 staple pins starter pack.', 380.00, 340.00, 60, 1, 2, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', 1, 0, 1, 4.8, 42, 'stapler,office,deli,desk accessories'),
('Faber-Castell Connector Paint Box 24 Watercolor Set', 'faber-castell-connector-paint-box-24', 'ART-FC-WCL-24', 'Vibrant watercolors with connector cups, mixing palette, and high pigment density.', 'Connector paint set from Faber-Castell allows creative combinations of colors. Includes brush and paint cups that can be clicked together.', 950.00, 880.00, 40, 4, 1, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600', 1, 1, 0, 4.9, 36, 'art,paint,watercolor,faber-castell'),
('Doms Neon Eraser & Pencil Combo Stationery Kit', 'doms-neon-stationery-combo-kit', 'SCH-DOMS-KIT-01', 'Complete school combo with pencils, neon erasers, sharpener and ruler.', 'High quality DOMS school kit perfect for students with super dark graphite pencils and dust-free soft erasers.', 180.00, 150.00, 200, 5, 7, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600', 0, 1, 1, 4.7, 59, 'school,pencil,doms,eraser,kids'),
('Zebra Sarasa Clip Gel Pen 0.5mm Vintage Colors', 'zebra-sarasa-clip-gel-pen-vintage', 'PEN-ZEB-SRS-05', 'Rapid dry water-based pigment gel pen with comfortable grip and sturdy binder clip.', 'Zebra Sarasa Vintage series offers elegant sepia, navy, and dark green shades with quick dry smudge-free technology.', 190.00, 175.00, 110, 3, 5, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600', 1, 1, 1, 4.9, 78, 'zebra,pen,sarasa,gel,vintage'),
('Executive PU Leather Document Tray & Desk Organizer', 'executive-leather-desk-organizer', 'ORG-DSK-LTR-01', 'Multi-slot luxury desk organizer for files, pens, smartphones, and note slips.', 'Keep your executive workstation spotless with this handcrafted PU leather organizer.', 1250.00, 1150.00, 25, 6, 2, 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?w=600', 1, 0, 0, 4.8, 19, 'desk,organizer,leather,office,storage'),
('Hardcover Spiral Dot Grid Journal A5 (160 Pages 100 GSM)', 'hardcover-spiral-dot-grid-journal-a5', 'NBK-JRN-A5-DOT', 'Fountain pen friendly thick 100 GSM acid-free dot grid pages with elastic closure band.', 'Designed for bullet journaling, sketching, and meeting notes without bleed-through or ghosting.', 420.00, 380.00, 75, 2, NULL, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', 1, 1, 1, 5.0, 92, 'notebook,journal,dot grid,a5,spiral');

-- 11. Seed Admin & Customer Users
-- Passwords: Admin@123 / Customer@123
INSERT INTO Users (FullName, Email, PasswordHash, PhoneNumber, RoleId)
VALUES
('Sobuj Enterprise Administrator', 'admin@sobujenterprise.com', '7/jKz/bX163mJj69sR2U3/qWJ14Xn73s6u9t2bV4h38=', '01711000000', 1),
('Tanvir Ahmed', 'customer@example.com', '9+kLz/cX274nKk70tS3V4/rXK25Yo84t7v0u3cW5i49=', '01712345678', 2);

