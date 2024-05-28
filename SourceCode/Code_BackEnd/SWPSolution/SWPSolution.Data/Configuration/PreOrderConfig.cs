using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using SWPSolution.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SWPSolution.Data.Configuration
{
    public class PreOrderConfig : IEntityTypeConfiguration<PreOrder>
    {
        public void Configure(EntityTypeBuilder<PreOrder> builder)
        {
            builder.HasOne(x => x.AppUser).WithMany(x => x.PreOrders).HasForeignKey(x => x.MemberId);
        }
    }
}
