﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace SWPSolution.Data.Entities;

public partial class Review
{
    public string ReviewId { get; set; }

    public string ProductId { get; set; }

    public string MemberId { get; set; }

    public DateTime? DataReview { get; set; }

    public int? Grade { get; set; }

    public string Comment { get; set; }

    public virtual Member Member { get; set; }

    public virtual Product Product { get; set; }

    public AppUser AppUser { get; set; }
}