const fs = require('fs')

class Container {

    constructor(file) { 
        this.file = file
        this.data = []

        try {
            this.read()
        } catch(e) {
            this.write()
        }
    }
    write() {
        fs.writeFileSync(this.file, JSON.stringify(this.data))
    }
    read() {
        this.data = JSON.parse(fs.readFileSync(this.file))
    }
    getLastID() {
        const n = this.data.length

        if (n < 1 ) return 0 

        return this.data[this.data.length - 1].id
    }
    save(obj) {
        const id = this.getLastID()
        this.data.push({...obj, ...{ id: id + 1}})
    }
    getByID(id) {
        return this.data.find(p => p.id == id)
    }
    getID(id) {
        return this.data.findIndex(p => p.id == id)
    }
    getAll() {
        return this.data
    }
    deleteByID(id) {
        const idx = this.data.findIndex(p => p.id == id)

        if ( idx === -1 ) {
            console.log('El producto que desea eliminar no existe.')
        } else {
            this.data.splice(idx,1)
            this.write()

        }
        
    }
    deleteAll() {
        this.data = []
        this.write()
    }
}

module.exports = Container;