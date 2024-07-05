using SWPSolution.Data.Entities;

public partial class Member
{
    public string MemberId { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string Email { get; set; }

    public string PhoneNumber { get; set; }

    public decimal? LoyaltyPoints { get; set; }

    public DateTime? RegistrationDate { get; set; }

    public string UserName { get; set; }

    public string PassWord { get; set; }

    public virtual ICollection<Address> Addresses { get; set; } = new List<Address>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<PreOrder> PreOrders { get; set; } = new List<PreOrder>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<GiftPurchase> GiftPurchases { get; set; } = new List<GiftPurchase>(); // Add this line
}
