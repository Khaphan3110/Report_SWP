﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SWPSolution.Data.Entities;

public partial class Promotion
{
    public string PromotionId { get; set; }

    public string Name { get; set; }

    public string DiscountType { get; set; }

    public int? DiscountValue { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [JsonIgnore]
    public Order order { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}