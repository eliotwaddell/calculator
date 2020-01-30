var display = document.querySelector('#screen');

function operate(operator, num1, num2)
{
    if(operator == "+")
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
    /*if(!(expr.charAt(0) <= '9' && expr.charAt(0) >= '0'))//if the expression doesn't start with a number, chop off first operator, might be unnecessary
    {

    }*/
    var regex = /[+-]?\d+(\.\d+)?/g;//regular expression
    var opRegex = /[+\-*/]/g;
    var numbers = expr.match(regex).map(function(v) { return parseFloat(v) });//shoutout stackoverflow, maps each parsed "float" string to a float
    var ops = expr.match(opRegex);//no need to map, ops are strings anyway
    var index = 0;//two tracking variables
    var result = 0;
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
            index = 0;
            result = operate(ops[index], numbers[index], numbers[index+1])//operates on elements sandwiching op
            ops.splice(index,1);//cuts out the used operator
            numbers[index+1] = result;//appends result to right side of used operation
            numbers.splice(index,1);//cuts out left side of used operation;
        }

    }
    display.textContent = result.toString();
}

expression("2*5*3*8/2+2");