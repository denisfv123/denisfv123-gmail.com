const chai = require('chai');
const path = require('path');

// expect path
chai.use(require('chai-fs'));

const { expect } = chai;

describe('EXIST FILES', () => {
    it('CodeStyle', (done) => {
        expect(path.join(__dirname, '../../.eslintrc.json')).to.be.a.path();

        done();
    });

    it('ComponentsUser', (done) => {
        expect(path.join(__dirname, '../../src/components/User/')).to.be.a.directory().with.files([
            'index.js', 'model.js', 'router.js', 'service.js', 'validation.js',
        ]);

        done();
    });

    it('ComponentsValidation', (done) => {
        expect(path.join(__dirname, '../../src/components/validation.js')).to.be.a.path();

        done();
    });

    it('Config', (done) => {
        expect(path.join(__dirname, '../../src/config/')).to.be.a.directory().with.files([
            'connection.js', 'middleware.js', 'router.js', 
        ]);

        done();
    });

    it('Error', (done) => {
        expect(path.join(__dirname, '../../src/error/ValidationError.js')).to.be.a.path();

        done();
    });

    it('Server', (done) => {
        expect(path.join(__dirname, '../../src/server/')).to.be.a.directory().with.files([
            'events.js', 'index.js', 'server.js', 
        ]);

        done();
    });

    it('Views', (done) => {
        expect(path.join(__dirname, '../../src/views/')).to.be.a.directory().with.files([
            'index.ejs', 'users.ejs',
        ]);

        done();
    });
});
