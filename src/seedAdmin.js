const SystemUser = require("./models/SystemUser");

async function seedAdmin() {
  const admins = [
    { email: "super@empedia.one", password: "12345678", name: "Super Admin", role: "superadmin" },
    { email: "admin@empedia.one", password: "12345678", name: "Admin User", role: "admin" }
  ];

  for (const admin of admins) {
    const existing = await SystemUser.findOne({ email: admin.email });
    if (!existing) {
      await SystemUser.create(admin);
      console.log(`Seeded admin: ${admin.email}`);
    }
  }
}

module.exports = seedAdmin;
