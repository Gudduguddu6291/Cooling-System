import Temp from '../models/Temperature.js';
export const addTemperature = async (req, res) => {
    try {
        const userId = req.userId;
        const { nickname, zone, targetTemp, serialNo } = req.body;

        if (!userId || !nickname || !zone || targetTemp === undefined || !serialNo) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newTemp = await Temp.create({
            name: nickname,
            zone,
            targettemp: Number(targetTemp),
            sensorId: serialNo,
            user: userId,
        });
        return res.status(201).json({ message: 'Temperature data added successfully', temperature: newTemp });
    } catch (error) {
        console.error('Error adding temperature data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


export const getTemperatures = async (req, res) => {
    const userId = req.userId;
    try {
        let temperatures = await Temp.find({ user: userId }).sort({ createdAt: -1 });

        if (!temperatures.length) {
            temperatures = await Temp.find({}).sort({ createdAt: -1 });
        }

        const formattedData = temperatures.map((t) => ({
            timestamp: t.createdAt || t.timestamp,
            temp: t.targettemp,
            efficiency: t.efficiency ?? 0,
            sensorId: t.sensorId,
            _id: t._id,
        }));

        return res.status(200).json(formattedData.reverse()); 
        
    } catch (error) {
        console.error('Error fetching temperatures:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
