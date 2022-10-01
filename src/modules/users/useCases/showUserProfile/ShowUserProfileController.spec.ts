import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;
describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "user",
        email: "user@example.com",
        password: "password",
      });

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@example.com",
        password: "password",
      });

    const { token } = responseToken.body

    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}`})

    expect(response.status).toBe(200);
  });

  it("should not be able to show a non existent profile", async () => {
    const response = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiMzI0YThiMzAtZjRkNS00ZTYwLWE3ZmQtYWYzMmU1ZjdlMzBlIiwibmFtZSI6InVzZXIiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJwYXNzd29yZCI6IiQyYSQwOCROUnBnbEpESlVzcURrcTF0T0RnYnVlUnhIeFRoZUpkNGNDdXM2akZ4eU1QdjNHTm4ubC9vYSIsImNyZWF0ZWRfYXQiOiIyMDIyLTEwLTAxVDIxOjI2OjMwLjM0OFoiLCJ1cGRhdGVkX2F0IjoiMjAyMi0xMC0wMVQyMToyNjozMC4zNDhaIn0sImlhdCI6MTY2NDY0ODc5MCwiZXhwIjoxNjY0NzM1MTkwLCJzdWIiOiIzMjRhOGIzMC1mNGQ1LTRlNjAtYTdmZC1hZjMyZTVmN2UzMGUifQ.mTnONOCw3EgWjmIqPmdZSw_MANsYM-7PAi7tBHReGYs"}`})

    console.log(response.body);

    expect(response.status).toBe(404);
  });
});
