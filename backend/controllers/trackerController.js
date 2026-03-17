const trackerModel = require('../models/trackerModel');

// Expects YYYY-MM-DD
const submitCycle = async (req, res) => {
    try {
        const { lastPeriodDate, cycleLength } = req.body;

        if (!lastPeriodDate || !cycleLength) {
            return res.status(400).json({ message: 'Missing fields' });
        }

        if (!req.user.isPremium && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Ovulation tracker is a premium feature' });
        }

        const lastPeriod = new Date(lastPeriodDate);
        const nextPeriod = new Date(lastPeriod);
        nextPeriod.setDate(lastPeriod.getDate() + cycleLength);

        const ovulationDate = new Date(nextPeriod);
        ovulationDate.setDate(nextPeriod.getDate() - 14);

        const fertileStart = new Date(ovulationDate);
        fertileStart.setDate(ovulationDate.getDate() - 5);

        const fertileEnd = new Date(ovulationDate);
        fertileEnd.setDate(ovulationDate.getDate() + 1);

        const cycleId = await trackerModel.saveCycle(
            req.user.id,
            lastPeriodDate,
            cycleLength,
            nextPeriod.toISOString().split('T')[0],
            ovulationDate.toISOString().split('T')[0],
            fertileStart.toISOString().split('T')[0],
            fertileEnd.toISOString().split('T')[0]
        );

        res.status(201).json({
            cycleId,
            nextPeriod: nextPeriod.toISOString().split('T')[0],
            ovulationDate: ovulationDate.toISOString().split('T')[0],
            fertileWindow: {
                start: fertileStart.toISOString().split('T')[0],
                end: fertileEnd.toISOString().split('T')[0]
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saving cycle' });
    }
};

const getMyCycles = async (req, res) => {
    try {
        const cycles = await trackerModel.getCyclesByUser(req.user.id);
        res.json(cycles);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching cycles' });
    }
};

module.exports = {
    submitCycle,
    getMyCycles
};
