
const request = require('supertest');
const chai = require('chai');

const server = require('../../src/server/server');

const { expect } = chai;

describe('UserComponent -> controller', () => {
    it('UserComponent -> controller -> /v1/users/', (done) => {
        request(server)
            .get('/v1/users/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {
                const expectBody = expect(body);

                expectBody.to.have.property('data').and.to.be.a('array');

                done();
            })
            .catch((err) => done(err));
    });

    let id;

    it('UserComponent -> controller -> POST /v1/users/', (done) => {
        request(server)
            .post('/v1/users/')
            .send({ email: 'UserComponent@gmail.com', fullName: 'UserComponent' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {

                id = body.data._id;

                const expectBody = expect(body);

                expectBody.to.have.property('data');

                done();
            })
            .catch((err) => done(err));
    });

    it('UserComponent -> controller -> GET /v1/users/:id', (done) => {
        request(server)
            .get(`/v1/users/${id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {

                const expectBody = expect(body);

                expectBody.to.have.property('data');

                done();
            })
            .catch((err) => done(err));
    });

    it('UserComponent -> controller -> PUT /v1/users/', (done) => {
        request(server)
            .put('/v1/users/')
            .send({ id, fullName: 'UserComponent222' })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {

                const expectBody = expect(body);

                expectBody.to.have.property('data');

                done();
            })
            .catch((err) => done(err));
    });

    it('UserComponent -> controller -> DELETE /v1/users/', (done) => {
        request(server)
            .delete('/v1/users/')
            .send({ id })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(({ body }) => {

                const expectBody = expect(body);

                expectBody.to.have.property('data');

                done();
            })
            .catch((err) => done(err));
    });

});
