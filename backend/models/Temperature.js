import mongoose from 'mongoose';

const temperatureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    zone: { type: String, required: true },
    targettemp: { type: Number, required: true },
    sensorId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: true });
const Temperature = mongoose.model('Temperature', temperatureSchema);
export default Temperature;
