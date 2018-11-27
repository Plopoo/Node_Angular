class AbstractOutput
{
    /**
     * Construct
     */
    constructor() {}

    getCleanedObject(values, object) {
        let obj = {}
        
        values.forEach(element => {
            obj[element] = object[element]
        });

        return obj
    }
}

module.exports = AbstractOutput;
