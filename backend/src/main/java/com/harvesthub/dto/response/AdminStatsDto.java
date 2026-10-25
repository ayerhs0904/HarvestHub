package com.harvesthub.dto.response;

import java.math.BigDecimal;

public class AdminStatsDto {
    private long totalUsers;
    private long totalFarms;
    private long verifiedFarms;
    private long pendingVerifications;
    private long totalListings;
    private long totalOrders;
    private BigDecimal grossMerchandiseValue;
    private BigDecimal rescuedProduceKg;
    private long activeGroupBuys;

    public AdminStatsDto() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalFarms() { return totalFarms; }
    public void setTotalFarms(long totalFarms) { this.totalFarms = totalFarms; }

    public long getVerifiedFarms() { return verifiedFarms; }
    public void setVerifiedFarms(long verifiedFarms) { this.verifiedFarms = verifiedFarms; }

    public long getPendingVerifications() { return pendingVerifications; }
    public void setPendingVerifications(long pendingVerifications) { this.pendingVerifications = pendingVerifications; }

    public long getTotalListings() { return totalListings; }
    public void setTotalListings(long totalListings) { this.totalListings = totalListings; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getGrossMerchandiseValue() { return grossMerchandiseValue; }
    public void setGrossMerchandiseValue(BigDecimal grossMerchandiseValue) { this.grossMerchandiseValue = grossMerchandiseValue; }

    public BigDecimal getRescuedProduceKg() { return rescuedProduceKg; }
    public void setRescuedProduceKg(BigDecimal rescuedProduceKg) { this.rescuedProduceKg = rescuedProduceKg; }

    public long getActiveGroupBuys() { return activeGroupBuys; }
    public void setActiveGroupBuys(long activeGroupBuys) { this.activeGroupBuys = activeGroupBuys; }
}
