// GET /api/dashboard — users report it takes ~4 seconds. Shop owners have 50-300 branches.
router.get("/api/dashboard", requireAuth, async (req, res) => {
  const branches = await prisma.branch.findMany({ where: { ownerId: req.user.id } });
  const result = [];
  for (const b of branches) {
    const todayBookings = await prisma.booking.count({ where: { branchId: b.id, date: today() } });
    const revenue = await prisma.payment.aggregate({ where: { branchId: b.id, date: today() }, _sum: { amount: true } });
    const staff = await prisma.staff.findMany({ where: { branchId: b.id } });
    result.push({ branch: b.name, todayBookings, revenue: revenue._sum.amount ?? 0, staffCount: staff.length });
  }
  res.json(result);
});
