const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const barangSchema = new Schema({
    nama: {
        type: String,
        required: true
    },
    harga: {
        type: Number,
        required: true
    },
    jumlah: {
        type: Number,
        required: true
    }
});

const Barang = mongoose.model('Barang', barangSchema);

module.exports = Barang;