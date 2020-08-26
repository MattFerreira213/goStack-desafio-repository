const request = require("supertest");
const app = require("../appIndex");
const { isUuid } = require("uuidv4");

describe("Repositories", () => {
    
    // Teste de criação de um novo repositório.
    it("should be able to create a new repository", async () => { 
        const response = await request(app) 
        .post("/repositories") 
        .send({
            url: "https://github.com/MattFerreira213/teste-rz-sistemas-q1",
            title: "Teste 1 - RZ Sistemas",
            techs: ["HTML", "CSS", "Bootstrap"]
        });

        expect(isUuid(response.body.id)).toBe(true);

        expect(response.body).toMatchObject({
            url: "https://github.com/MattFerreira213/teste-rz-sistemas-q1",
            title: "Teste 1 - RZ Sistemas",
            techs: ["HTML", "CSS", "Bootstrap"],
            likes: 0
        });
    });

    // Teste de listagem de repositórios
    it("should be able to list the repositories", async () => {  
        const repository = await request(app)
        .post("/repositories")
        .send({
            url: "https://github.com/MattFerreira213/teste-rz-sistemas-q1",
            title: "Teste 1 - RZ Sistemas",
            techs: ["HTML", "CSS", "Bootstrap"]
        });

        const response = await request(app).get("/repositories");

        expect(response.body).toEqual(
            expect.arrayContaining([
                {
                    id: repository.body.id,
                    url: "https://github.com/MattFerreira213/teste-rz-sistemas-q1",
                    title: "Teste 1 - RZ Sistemas",
                    techs: ["HTML", "CSS", "Bootstrap"],
                    likes: 0
                }
            ])
        );
    });

    // Teste de atualização de um repositório.
    it("should be able to update repository", async () => {
        const repository = await request(app)
        .post("/repositories")
        .send({
            url: "https://github.com/MattFerreira213/teste-rz-sistemas-q1",
            title: "Teste 1 - RZ Sistemas",
            techs: ["HTML", "CSS", "Bootstrap"]
        })

        const response = await request(app)
        .put(`/repositories/${repository.body.id}`)
        .send({
            url: "https://github.com/MattFerreira213/teste-rz-sistemas-q1",
            title: "Teste 1 - RZ Sistemas",
            techs: ["HTML", "CSS", "Angular9", "JavaScript"]
        });

        expect(isUuid(response.body.id)).toBe(true);

        expect(response.body).toMatchObject({
            url: "https://github.com/MattFerreira213/teste-rz-sistemas-q1",
            title: "Teste 1 - RZ Sistemas",
            techs: ["HTML", "CSS", "Angular9", "JavaScript"]
        });
    });

    // Teste que não permite a atualização de um repositório inexistente.
    it("should not be able to update a repository that does not exist", async () => {
        await request(app).put(`/repositories/123`).expect(400);
    });

    // Teste que não permite a atualização de curtidas de um repositório manualmente.
    it("should not be able to update repository likes manually", async () => {
        const repository = await request(app)
        .post("/repositories")
        .send({
            url: "https://github.com/MattFerreira213/teste-rz-sistemas-q1",
            title: "Teste 1 - RZ Sistemas",
            techs: ["HTML", "CSS", "Angular9", "JavaScript"]
        });

        const response = await request(app)
        .put(`/repositories/${repository.body.id}`)
        .send({
            likes: 15
        });

        expect(response.body).toMatchObject({
            likes: 0
        });
    });

    //Teste de deletar um repositório.
    it("should be able to delete the repository", async () => {
        const response = await request(app)
        .post("/repositories")
        .send({
            url: "https://github.com/MattFerreira213/teste-rz-sistemas-q1",
            title: "Teste 1 - RZ Sistemas",
            techs: ["HTML", "CSS", "Bootstrap"]
        });

        await request(app).delete(`/repositories/${response.body.id}`).expect(204);

        const repositories = await request(app).get("/repositories");

        const repository = repositories.body.find((r) => r.id === response.body.id);

        expect(repository).toBe(undefined);
    });

    // Teste que não permite deletar de um repositório inexistente.
    it("should not be able to delete a repository that does not exist", async () => {
        await request(app).delete(`/repositories/123`).expect(400);
    });
});
