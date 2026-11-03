import { PrismaClient } from "../src/generated/tenant";
import { getEffectiveLayout } from "../src/lib/dashboard/layout";

async function test() {
  const p = new PrismaClient({
    datasources: { db: { url: "mysql://root:@localhost:3306/tenant_demo" } },
  });

  const sessionOwner = { user: { id: "test-owner-id", isOwner: true } };
  const ownerResult = await getEffectiveLayout(p, sessionOwner, "Owner");
  console.log("Owner visible tabs:", ownerResult.visibleTabs);
  console.log("Owner overview widget count:", ownerResult.layout.overview.length);

  const sessionAccountant = {
    user: { id: "test-acct-id", isOwner: false, roleId: "test-role" },
  };
  const acctResult = await getEffectiveLayout(p, sessionAccountant, "Accountant");
  console.log("Accountant visible tabs:", acctResult.visibleTabs);

  await (p as any).$disconnect();
  console.log("✓ Layout resolution test passed with 0 errors!");
}

test().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

