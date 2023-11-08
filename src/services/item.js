class ItemService{
    constructor(ItemModel){
        this.item = ItemModel
    }

    async get(){
        const item = await this.item.findAll()
        return item
    }

    
}

module.exports = ItemService