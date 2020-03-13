//budget controller
var budgetcontroller = (function()  {

    var Income = function(id, description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcper = function(totalincome) {
        if(totalincome > 0) {
        this.percentage = Math.round( this.value / totalincome * 100);
        } else {
            this.percentage = -1;
        }
    };
    Expense.prototype.getpercentage = function () {
        return this.percentage;
    };
    var claculatingtotal = function(type) {
        var sum = 0;
        // calculating the total income or expenses 
        // let exp.value [100, 200, 300] for each sum is 0+100 ,100+200, 200 +300
        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });
        //saving all the total income and expenses in totals
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    return {
        // this will be used to enter the income or expanse into the data structurs
        addItem: function(type, des, val) {
            var newItem, ID;
            // calculate the id for the new element
            //where data.allItems[type] is to access the data structure and [data.all.Item[type].length-1] is for the numberor position or id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
             }else {
                ID = 0;
            } 
            //adding data to the income and expanse 
            if (type === 'exp') {
            newItem = new Expense(ID,des,val);
            }
            else if (type === 'inc') {
            newItem = new Income(ID, des, val);
            }
            // adding the income and expense to the datastructure
            data.allItems[type].push(newItem);
            
            return newItem;
        },
        deletingItem: function(type, id) {
            var ids, index;
            // id = 6
            // data.allitem[type][id];
            //ids = [1 2 4 8]
            //index = 3
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            
            index = ids.indexOf(id);
        
            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }

        },
        calculateBudget: function () { 
            //calculate total income and expenses
            claculatingtotal('inc');
            claculatingtotal('exp');

            //calculate budget: income - expenses
            data.budget = data.totals['inc'] - data.totals['exp'];
            
            //claculate the percentages of income and expenses
            if(data.totals['inc'] > 0){
            data.percentage = Math.round(data.totals['exp'] / data.totals['inc'] * 100);
            } else {
                data.percentage = -1;
            } 
        },

        calcpercentage: function(){
            data.allItems.exp.forEach(function (curr){
                curr.calcper(data.totals.inc);
            });
        },
        getpercentages: function() {
            var  allper = data.allItems.exp.map(function(cur) {
                return cur.getpercentage();
            });
            return allper;
        },

        getbudgt: function() {
            return {
                budget: data.budget,
                totalinc: data.totals.inc,
                totalexp: data.totals.exp,
                percentage: data.percentage
            }
        },
        
        testing: function (){ 
            return data;
        }
    };


})();


//uicontroler 
var uicontroller = (function() {
    //getting all the classes of ui for use
    
    var DOMstrings = {
        inputtype: '.add__type',
        inputDescription: '.add__description',
        inputvalue: '.add__value',
        inputbtn: '.add__btn',
        incomecontiner: '.income__list',
        expansescontainer: '.expenses__list',
        budgetLable: '.budget_value',
        incomeLable:'.budget__income--value',
        expensesLable:'.budget__expenses--value',
        percentageLable:'.budget__expenses--percentage',
        container: '.container',
        percentage: '.item__percentage',
        month: '.budget__title--month'
    };
    var formatnumber = function(num)  { 
        var int, dec, numsplit;
        num = Math.abs(num);
        num = num.toFixed(2);
        numsplit = num.split('.');
        int = numsplit[0];
        if(int.length > 3) {
            int = int.substr(0, (int.length - 3)) + ',' + int.substr((int.length - 3), 3);
        }
        dec = numsplit[1];
        return int + '.' + dec;
    };
    // making every ui element visible to the controller
    return {
        // getting all the input element
        getinput : function(){
            return {
                type: document.querySelector(DOMstrings.inputtype).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputvalue).value)
            };
        },
        addistItem: function(obj, type) {
            var html, newhtml, element;
            // adding the input information to the ui for display with html 
            if (type === 'inc') {
            element = DOMstrings.incomecontiner;
            html = '<div class="item" id="inc-%id%"><div class="right"><div class="item__description">%description%</div><div class="item__value">+ %value%</div></div><div class="item__delete"><button class="item__delete--btn btn__income" id="delete">x</button></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expansescontainer;
                html = '<div class="item" id="exp-%id%"><div class="right"><div class="item__description">%description%</div><div class="perc"><div class="item__value">- %value%</div><div class="item__percentage">21%</div></div></div><div class="item__delete"><button class="item__delete--btn btn__expenses" id="delete">x</button></div></div>';
            }
            // mmodefing the ui template with the accurate information
            newhtml = html.replace('%id%', obj.id);
            newhtml = newhtml.replace('%description%', obj.description);
            newhtml = newhtml.replace('%value%',formatnumber(obj.value));

            document.querySelector(element).insertAdjacentHTML('beforeend', newhtml);

        },
        deleteItemList: function(selectorid) {
            var delid = document.getElementById(selectorid);
            delid.parentNode.removeChild(delid); 
        },
        // clear fields constructor function 
        clearFields: function(){
            var field, fieldarray;
            //selecting both the input fields with the help off queryseclctorAll 
            field = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputvalue);
            //converting the both selection field into array 
            fieldarray = Array.prototype.slice.call(field); //slic can not be used with the non array element so we used calling method for it 
            // changing each element to the clear state with the foreach loop which will loop through both the elements 
            fieldarray.forEach(function (current, index, Array) {//foreach we get access to the current element and index of it like 0,1 and array itself 
                current.value = ""; 
            });
            //here we used focus function to focus on the first input description
            fieldarray[0].focus();
        },
        displayBudget: function (obj) {
            if (obj.budget > 0){
            document.querySelector(DOMstrings.budgetLable).textContent = '+' + formatnumber(obj.budget);
            } else if (obj.budget <= 0) {
                document.querySelector(DOMstrings.budgetLable).textContent = formatnumber(obj.budget);                
            }
            document.querySelector(DOMstrings.incomeLable).textContent ='+' + formatnumber(obj.totalinc);
            document.querySelector(DOMstrings.expensesLable).textContent = '-' + formatnumber(obj.totalexp);
            if (obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLable).textContent ='---';
            }
        }, 
        displaypercentage: function(per) {
            var fields = document.querySelectorAll(DOMstrings.percentage);
            // using the firstclass function
            var nodeListForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fields, function(current, index) {
                
                if (per[index] > 0) {
                    current.textContent = per[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },
        updatedate: function(){
            var now, months, months, year;
            now = new Date();
            months = ['January', 'Fabruary', 'March', 'April', 'May', 'June', 'July', 'Augst', 'September', 'October', 'November', 'December' ];
            month = now.getMonth();
            document.querySelector(DOMstrings.month).textContent = months[month] + ' ' + now.getFullYear();
        },
        //making the dom element visible to the cotroller to use
        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();



//global app controller
var controller = (function(budgetctrl, uictrl) {
    var setupEventListioners = function() {
        uictrl.updatedate();
        var DOM = uictrl.getDOMstrings();

        document.querySelector(DOM.inputbtn).addEventListener('click', ctrlAddItem);
   
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13){
            ctrlAddItem();
            }
        });
        document.querySelector(DOM.container).addEventListener('click', controldeleteItem);
    };
    var updatebudget = function() {
        //calculate the budget
        budgetctrl.calculateBudget();

        //return the budget
        var budget = budgetctrl.getbudgt();

        //display the budget on the ui 
        uictrl.displayBudget(budget);
    };
    var updatepercentage = function() {
        //1. calculating percentage
        budgetctrl.calcpercentage();
        //2. read percentage from the budget controller
        var  percentages = budgetctrl.getpercentages();
        //update the ui based on the percentages
        uictrl.displaypercentage(percentages);
    };

    var ctrlAddItem = function() {
        //taking the inputs 
        var input = uictrl.getinput();
        
        if (input.description !=="" && !isNaN(input.value)) {
        //calling the public function constructor add item to add input to the data structure
        var newItem = budgetctrl.addItem(input.type,input.description,input.value);
        
        // calling the public function of ui controller addlistItems for displaying in ui 
        uictrl.addistItem(newItem,input.type);

        //clearing the inputs fields
        uictrl.clearFields();
        //updating the budget    
        updatebudget();    
        //updating the percentager
        updatepercentage();
    }

    };
    var controldeleteItem = function(event) {
       var itemID, splitid ,type, id;
       if(event.target.id == 'delete'){
       itemID = event.target.parentNode.parentNode.id;
       if(itemID) {
        splitid = itemID.split('-');
        type = splitid[0];
        id =  parseInt(splitid[1]);
       //deleting the delete item form the data base
        budgetctrl.deletingItem(type,id);
        //deleting item from the ui
        uictrl.deleteItemList(itemID);
        //updating the budget
        updatebudget();
       }

    }

    };
    
    return {
      init : function(){
        console.log('application is started');
        uictrl.displayBudget({
            budget:0,
            totalinc:0,
            totalexp:0,
            percentage:-1
        });
        setupEventListioners();
        }        
    }
   

})(budgetcontroller,uicontroller);



controller.init();






