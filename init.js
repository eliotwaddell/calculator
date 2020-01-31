var display = document.querySelector('#screen');
var buttons = document.querySelector('#buttons').querySelectorAll('div');
var SIGDIG = 10000000;//for fixing float problems
var userInput = '';//input to be filtered and displayed
var pointUsed = false; //this is so user can't use more than one decimal per item
var opUsed = false;//to avoid double operators

function floatFix(fl)
{
    return Math.floor((fl)*SIGDIG)/SIGDIG;//truncates any tiny digits
}

function operate(operator, num1, num2)
{
    if(operator == "+")//self explanatory
    {
        return num1+num2;
    }
    else if(operator == "-")
    {
        return num1-num2;
    }
    else if(operator == "*")
    {
        return num1*num2;
    }
    else if(operator == "/")
    {
        return num1/num2;
    }
}

function expression(expr)
{
    if(!(expr.charAt(expr.length-1) <= '9' && expr.charAt(expr.length-1) >= '0'))//if the expression doesn't end with a number, chop off last operator
    {
        expr = expr.slice(length-1,length);
    }
    var regex = /\d+(\.\d+)?/g;//regular expression
    var opRegex = /[+\-*/]/g;
    var numbers = expr.match(regex).map(function(v) { return parseFloat(v) });//shoutout stackoverflow, maps each parsed "float" string to a float
    var ops = expr.match(opRegex);//no need to map, ops are strings anyway
    var index = 0;//two tracking variables
    var result = numbers[0];//initialize in case of 1 number input
    while(numbers.length>1)//as long as there are two numbers, they can be operated on
    {
        if(ops.includes('*'))
        {
            index = ops.indexOf('*');
            result = operate('*', numbers[index], numbers[index+1])//operates on elements sandwiching op
            ops.splice(index,1);//cuts out the used operator
            numbers[index+1] = result;//appends result to right side of used operation
            numbers.splice(index,1);//cuts out left side of used operation;
        }
        else if(ops.includes('/'))
        {
            index = ops.indexOf('/');
            result = operate('/', numbers[index], numbers[index+1])//operates on elements sandwiching op
            ops.splice(index,1);//cuts out the used operator
            numbers[index+1] = result;//appends result to right side of used operation
            numbers.splice(index,1);//cuts out left side of used operation;
        }
        else
        {
            index = 0;//no need for order of ops
            result = operate(ops[index], numbers[index], numbers[index+1])//operates on elements sandwiching op
            ops.splice(index,1);//cuts out the used operator
            numbers[index+1] = result;//appends result to right side of used operation
            numbers.splice(index,1);//cuts out left side of used operation;
        }
    }
    result = floatFix(result);
    if(!(result>99999999))
    {
        display.textContent = result.toString();
        userInput = result.toString();
    }
    else
    {
        display.textContent = "OVERFLOW";
        userInput = '';
    }
    pointUsed = false;//clean slate
    opUsed = false;
}

function addToDisplay(newInput)//filters incoming input
{
    if(newInput == '.')//adds floating point but flags its usage, meaning it can't be used again
    {                //on this number
        if(pointUsed)
        {
            return;
        }
        if(!(userInput.charAt(userInput.length-1) >= '0' && userInput.charAt(userInput.length-1) <= '9'))
        {//if a float doesnt start with a number
            userInput += '0';//set it to be 0.something
        }
        userInput += newInput;
        pointUsed = true;//no double points
        return;
    }
    if(['+','-','*','/'].indexOf(newInput) != -1)//if the input is an operator
    {
        if(userInput.length == 0)
        {
            if(newInput == '-')
            {
                userInput += newInput;
                opUsed = true;
                pointUsed = false;
            }
            return;
        }
        if(opUsed)
        {
            return;
        }
        userInput += newInput;
        opUsed = true;
        pointUsed = false;
        return;
    }
    opUsed = false;
    userInput += newInput;
    return;

}

function update()//function used to literally update the screen
{
    var shownDisplay = userInput;
    if(userInput.length>8)
    {
        shownDisplay = userInput.substr(userInput.length-8,userInput.length);
    }
    display.textContent = shownDisplay;
}

for (var x of buttons)//iterates through the input buttons to allow them to be used w/eventlisteners
{
    if(x.className=="displayed")//buttons that cause the display to change.
    {
        x.addEventListener("click", function(e)
        {
            addToDisplay(e.target.id);
            update();
        });
    }
    if(x.id == "AC")//resets the display and stored values
    {
        x.addEventListener("click", function(e)
        {
            userInput = '';
            opUsed = false;
            pointUsed = false;
            update();
        });
    }
    if(x.id == '=')
    {
        x.addEventListener("click", function(e)
        {
            expression(userInput);
            update();
        });
    }
    if(x.id == 'C')
    {
        x.addEventListener("click", function(e)
        {
            userInput = userInput.substr(0, userInput.length-1);
            update();
        });
    }
    if(x.id == 'SQRT')
    {
        x.addEventListener("click", function(e)
        {

        });
    }
}
