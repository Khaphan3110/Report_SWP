﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using SWPSolution.Data.Enum;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SWPSolution.Data.Entities;

public partial class PreOrder
{
    public string PreorderId { get; set; }

    public string ProductId { get; set; }

    public string MemberId { get; set; }

    public int? Quantity { get; set; }

    public DateTime? PreorderDate { get; set; }

    public double Price { get; set; }

    public PreOrderStatus Status { get; set; }

    [JsonIgnore]
    public virtual Member Member { get; set; }
    [JsonIgnore]
    public virtual Product Product { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
}