# Multi-shop SaaS with wallet (Next.js on Vercel + Prisma + Supabase PostgreSQL 15)

User: "เมื่อคืนเว็บล่ม error `too many connections` แล้วตอนเช้าลูกค้าร้าน A บอกว่าเห็นลูกค้าของร้าน B ด้วย แถมยอด wallet บางคนติดลบ ช่วยดูทั้งหมดหน่อย"

```prisma
model Customer {
  id     Int    @id @default(autoincrement())
  shopId Int
  email  String @unique
  name   String
}
model Wallet {
  id         Int @id @default(autoincrement())
  customerId Int @unique
  balance    Float
}
```

```ts
// lib/db.ts
export const prisma = new PrismaClient();   // DATABASE_URL = direct connection, port 5432

// app/api/customers/route.ts
export async function GET(req: Request) {
  const shopId = Number(new URL(req.url).searchParams.get('shopId'));   // from query string
  return Response.json(await prisma.customer.findMany({ where: { shopId } }));
}

// app/api/wallet/pay/route.ts
export async function POST(req: Request) {
  const { customerId, amount } = await req.json();
  await prisma.$transaction(async (tx) => {
    const w = await tx.wallet.findUnique({ where: { customerId } });
    await fetch('https://partner.example/notify', { method: 'POST', body: JSON.stringify({ customerId, amount }) });
    await tx.wallet.update({ where: { customerId }, data: { balance: w!.balance - amount } });
  }, { timeout: 60000 });
}
```
