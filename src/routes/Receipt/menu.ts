import { Router } from 'express'
import mongoose from 'mongoose';
import { auth } from '../../middleware/auth'
import Menu, { IItemOptions, IUnitOption, IMenuItem, ItemOptionsSchema } from '../../models/Receipt/Menu';
import Units from '../../models/Unit';

const router = Router()

// check unit options
const checkForFlavor= (flavor: string, optionList: IItemOptions[]) => {
    if(!flavor || flavor.length === 0){
        throw new Error('Flavor can not be empty');
    }

    // dont want any duplciate flavor
    optionList.forEach((option) => {
        if(option.flavor === flavor){
            throw new Error('Duplicate Flavor');
        }
    })
}

const checkForUnitOption = (unitOption: IUnitOption, unitOptionList: IUnitOption[]) => {
    // check for string and non null for unit 
    if(!unitOption.unit|| unitOption.unit.length === 0){
        throw new Error('Unit can not be empty')
    }

    if(typeof unitOption.unit !== 'string'){
        throw new Error('Unit must be a string')
    }

    // check for positive and non null number for price
    if(!unitOption.price || unitOption.price < 0){
        throw new Error('Price must be a positive and not empty')
    }
    
}

function hasDuplicates(array: string[]) {
    return (new Set(array)).size !== array.length;
}

router.get('/menu', auth, async(req, res) => {
    try {
        let menus = await Menu.findOne({
            owner: req.user?._id
        });

        if(!menus){
            menus = new Menu({
                menu: [],
                owner: req.user?._id
            });
        }

        await menus.save()

        res.status(200).send({menu: menus.menu});
    } catch (error) {
        res.status(400).send({ error: (error as Error).message});
    }
})

router.post('/menu', auth, async(req, res) => {
    try {
        const { name, options }: {name: string, options: IItemOptions[]} = req.body;

        // make sure the user data (name) is not null or empty
        if(!name || name.length === 0){
            return res.status(400).send({ error: 'Missing field (Name)' });
        }

        // check if the owner has menus in the database
        const result = await Menu.findOne({ owner: req.user?._id });

        if(!result){
            return res.status(404).send({ error: 'Not Found'});
        }

        // check if the name is duplicate
        result.menu.find((item) => {
            if(item.name === name){
                throw new Error('Duplicate name is not allowed');
            }
        })

        // check if flavor is duplicated
        let flavorList: string[] = [];
        let unitList: string[] = [];
        options.forEach((option) => {
            flavorList.push(option.flavor);

            unitList = [];
            option.unitOption.forEach((unit) => {
                checkForUnitOption(unit, option.unitOption);
                unitList.push(unit.unit);
                delete unit._id;
            })

            if(hasDuplicates(unitList)){
                throw new Error('Duplicate Unit is not allow');
            }
        })

        if(hasDuplicates(flavorList)){
            throw new Error('Duplicate Flavor is not allow');
        }
        
        result.menu.unshift({
            name: name,
            options: options
        })

        await result.save();
        
        res.status(201).send({ option: result.menu[0] });
        

    } catch (error) {
        console.log(error);
        res.status(400).send({ error: (error as Error).message });
    }
})

// update name of menu item 
router.delete('/menu/:menuItemId', auth, async(req, res) => {
    try {
        const result = await Menu.findOne({ owner: req.user?.id});

        if(!result){
            return res.status(404).send({ error: 'Not Found' });
        }

        result.menu = result.menu.filter((item) => {
            return item._id?.toString() !== req.params.menuItemId;
        })

        await result.save();

        res.status(200).send();
    } catch (error) {
        res.status(400).send({ error: (error as Error).message});
    }
})

// update name of menu item 
router.patch('/menu/:menuItemId/name', auth, async(req, res) => {
    try {
        const result = await Menu.findOne({ owner: req.user?.id});

        if(!result){
            return res.status(404).send({ error: 'Not Found'});
        }

        let option = result.menu.find((item) => {
            return item._id?.toString() === req.params.menuItemId;
        });

        if(!option){
            return res.status(404).send({ error: 'Menu Item Not Found'});
        }

        let data = req.query.data as string;
        if(data.length === 0){
            throw new Error('Name can not be empty');
        }

        result.menu.find((item) => {
            if(item.name === data){
                throw new Error('Name duplicate not allowed');
            }
        })

        option.name = req.query.data as string;

        await result.save();
        
        res.status(200).send();
    } catch (error) {
        res.status(400).send({ error: (error as Error).message});
    }
})

// handling adding a new option
router.post('/menu/:menuItemId/option', auth, async (req, res) => {
    try {
        let { flavor, unitOptionList} : { flavor: string, unitOptionList: IUnitOption[]}= req.body;

        // locate the menu for the user 
        const result = await Menu.findOne({ owner: req.user?.id });

        if(!result){
            return res.status(404).send({ error: 'Not Found'});
        }

        // locate the menu item with the valid menu item id
        const menuItem = result.menu.find((item) => {
            return item._id?.toString() === req.params.menuItemId;
        })

        if(!menuItem){
            return res.status(404).send({ error: 'Menu Item Not Found'});
        }

        // double check for valid flavor value
        console.log(flavor);
        console.log(menuItem.options);
        checkForFlavor(flavor, menuItem.options);

        // double check with in the unit option to find any duplicates
        let tempUnitNameList:string[] = [];
        let tempUnitList:IUnitOption[] = [];

        unitOptionList.forEach((el) => {
            tempUnitNameList.push(el.unit);
            tempUnitList.push({
                unit: el.unit,
                price: el.price,
            })
        });

        if(hasDuplicates(tempUnitNameList)){
            return res.status(400).send({ error: 'Duplicated Unit not allowed'})
        }

        // push the new options in to the array
        menuItem.options.unshift({
            flavor: flavor, 
            unitOption: tempUnitList,
        })

        await result.save();

        // send back the first in the array since it was unshift into the array
        res.status(200).send({ option: menuItem.options[0] });
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: (error as Error).message});
    }
})

// handle deleting an option
router.delete('/menu/:menuItemId/option/:optionId', auth, async (req, res) => {
    try {
        // find menu for the user
        const result = await Menu.findOne({ owner: req.user?.id });

        if(!result){
            return res.status(404).send({ error: 'Not Found'});
        }
    
        // find the valid option
        let menuItem = result.menu.find((element) => {
            return element._id?.toString() === req.params.menuItemId;
        })

        if(!menuItem){
            return res.status(404).send({ error: 'Menu Item Not Found'});
        }

        menuItem.options = menuItem.options.filter((option) => {
            return option._id?.toString() !== req.params.optionId
        })

        console.log(menuItem.options);
        
        await result.save();
    
        res.status(200).send();
    } catch (error) {
        
    }
})

// update a specific option
// handling add, remove, and update unit options
router.patch('/menu/:menuItemId/option/:optionId', auth, async(req, res) => {
    try {
        // going to update a certain option in the menu array
        // req.params.id will contain the option id
        // req.body will contain flavor: string , removeOption : [], addOption: [], updateOption: []
        let { flavor, removeOption, addOption, updateOption } : {flavor: string, removeOption: [], addOption: [], updateOption: []}= req.body;

        // Search for menu belong to the owner
        const result = await Menu.findOne({ owner: req.user?.id});

        if(!result){
            return res.status(404).send({ error: 'Menu Not Found'});
        }

        // search for the menu item with the correct menu id
        let menuItem = result.menu.find((option) => {
           return option._id?.toString() === req.params.menuItemId 
        });

        if(!menuItem){
            return res.status(404).send({ error: 'Menu Item not found'});
        }

        // search for the option with the correct option id
        let option = menuItem.options.find((option) => {
            return option._id?.toString() === req.params.optionId;
        });

        if(!option){
            return res.status(404).send({ error: 'Not Found'});
         }

        //  check and set the flavor 
        if(flavor.length !== 0){
            checkForFlavor(flavor, menuItem.options);
            option.flavor = flavor;
        }

        if(option.unitOption.length + addOption.length - removeOption.length <= 0){
            return res.status(400).send({ error: 'Empty option not allow, consider deleting the option'});
        }
        
        // manage and add any option in the request
        if(addOption.length > 0){
                addOption.forEach((unitOption: IUnitOption) => {
                    if(option){
                        checkForUnitOption(unitOption, option.unitOption);
    
                        option?.unitOption.unshift({
                         unit: unitOption.unit,
                         price: unitOption.price   
                        });
                    }
                })
            
        }

        // delete any option in the request
        if(removeOption.length > 0){
            removeOption.forEach((unitOption: IUnitOption) => {
                if(option){
                    option.unitOption = option.unitOption.filter((unit) => {
                        return unit._id?.toString() !== unitOption._id;
                    })
                }

            })
        }
      
        if(updateOption.length > 0){
            updateOption.forEach((unitOption: IUnitOption) => {
                if(option){
                    
                    // try to find and update the unit option
                    let tempUnit = option.unitOption.find((unit) => {
                        return unit._id?.toString() === unitOption._id
                    })

                    if(!tempUnit){
                        return res.status(404).send({ error: 'Unit option not found'})
                    }

                    checkForUnitOption(unitOption, option.unitOption);

                    tempUnit.unit =  unitOption.unit;
                    tempUnit.price = unitOption.price;
                }
            })
        }
        await result.save()
        res.status(200).send({ option });
    } catch (error) {
        console.log( (error as Error).stack)
        res.status(400).send({ error: (error as Error).message});
    }
})

export default router;