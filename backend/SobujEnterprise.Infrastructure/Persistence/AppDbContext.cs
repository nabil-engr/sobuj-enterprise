using Microsoft.EntityFrameworkCore;
using SobujEnterprise.Domain.Entities;

namespace SobujEnterprise.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Brand> Brands => Set<Brand>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<ProductImage> ProductImages => Set<ProductImage>();
        public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
        public DbSet<FilterAttribute> FilterAttributes => Set<FilterAttribute>();
        public DbSet<FilterAttributeValue> FilterAttributeValues => Set<FilterAttributeValue>();
        public DbSet<ProductFilterValue> ProductFilterValues => Set<ProductFilterValue>();
        public DbSet<WhatsAppTemplate> WhatsAppTemplates => Set<WhatsAppTemplate>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<User> Users => Set<User>();
        public DbSet<UserAddress> UserAddresses => Set<UserAddress>();
        public DbSet<Role> Roles => Set<Role>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Composite key for ProductFilterValue
            modelBuilder.Entity<ProductFilterValue>()
                .HasKey(pfv => new { pfv.ProductId, pfv.FilterAttributeValueId });

            modelBuilder.Entity<ProductFilterValue>()
                .HasOne(pfv => pfv.Product)
                .WithMany(p => p.FilterValues)
                .HasForeignKey(pfv => pfv.ProductId);

            modelBuilder.Entity<ProductFilterValue>()
                .HasOne(pfv => pfv.FilterAttributeValue)
                .WithMany(fav => fav.ProductFilterValues)
                .HasForeignKey(pfv => pfv.FilterAttributeValueId);

            // Unique indexes
            modelBuilder.Entity<Category>().HasIndex(c => c.Slug).IsUnique();
            modelBuilder.Entity<Brand>().HasIndex(b => b.Slug).IsUnique();
            modelBuilder.Entity<Product>().HasIndex(p => p.Slug).IsUnique();
            modelBuilder.Entity<Product>().HasIndex(p => p.SKU).IsUnique();
            modelBuilder.Entity<Order>().HasIndex(o => o.OrderNumber).IsUnique();
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<Role>().HasIndex(r => r.RoleName).IsUnique();
            modelBuilder.Entity<WhatsAppTemplate>().HasIndex(t => t.TemplateType).IsUnique();
            modelBuilder.Entity<UserAddress>().HasOne(a => a.User).WithMany(u => u.Addresses).HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.Cascade);
        }
    }
}
