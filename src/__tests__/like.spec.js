const request = require("supertest");
const app = require("../appIndex");

// Teste de dar um like em um repositório.
describe("Likes", () => {
    it("should be able to give a like to the repository", async () => {
        const repository = await request(app)
        .post("/repositories")
        .send({
            url: "https://github.com/MattFerreira213/teste-rz-sistemas-q1",
            title: "Teste 1 - RZ Sistemas",
            techs: ["HTML", "CSS", "Bootstrap"]
        });

        let response = await request(app).post(
            `/repositories/${repository.body.id}/like`
        );

        expect(response.body).toMatchObject({
            likes: 1
        });

        response = await request(app).post(
            `/repositories/${repository.body.id}/like`
        )

        expect(response.body).toMatchObject({
            likes: 2
        });
    });

    // Teste que não permite dar like em um repositorio que não existe.
    it("should not be able to like a repository that does not exist", async () => {
        await request(app)
        .post(`/repositories/123/like`)
        .expect(400);
    });
});