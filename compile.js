function lexer(input){   // takes input and return tokens
const tokens  = [];
let cursor =0; // scans our source code ,jaha bhi space  aega vo usse pehle vali chhej ka token bana dega chacrcter by char read karega

while(cursor < input.length) {// jab tak input length se kam hai
    let char = input[cursor];   // current character ko lenge

        // skip white space
        if(/\s/.test(char)){   // returns a bolean value
            cursor ++;
             continue;
        }

        if (/[a-zA-Z]/ .test (char)){  // if current char is alphabet a to z
          let word ='';
          while(/[a-zA-Z0-9]/.test(char)){
                word+= char;   // jab tak hame alphabet mil raha hai ham use word me append kar rahe hain
                char = input [++ cursor]; // char milte jaenge,cursor aage karte raho
          }
          if (word=='ye' || word =='bol'){
                tokens.push({type: 'keyword', value : word});  // agar keywoed hai toh ham object push karenge token me
          } else{
            tokens.push({type : ' identifier', value : word}); // identifie or variable mile agar
          }
          continue;
        }
            // tokenise numbers
        if(/[0-9]/.test(char)){
            let num ='';
            while(/[0-9]/.test(char)) {
                num+= char;
                char = input[++ cursor];
            }
            tokens.push({type:'number', value: parseInt(num)});  //parseint matlab hame ja number mila usse integer me convert karke store kar lenge
        }

        // tokenize operators and equals sign
            if (/[\+\-\*\/=]/.test (char)) {
                tokens.push({type: 'operator', value :char});
                cursor++;
                continue;
            }

}
return tokens
}

function parser(tokens){
const ast ={
    type: 'program',
    body :[]   // tree type prgram have an array of statements 
};

while(tokens.length>0){ // jab tak tokens hain
    let token = tokens.shift(); // token utha liya
    if (token.type ==='keyword' && token.value === 'ye'){
let declaration ={
    type: 'Declaration',
    name:tokens.shift().value, // token name hai ye par value nahi pata
    value : null 
};
// check for assignment
if(tokens[0].type==='operator'&& tokens[0].value ==='='){  // as we stored token as array
    tokens.shift(); // consume  ' ='
    // parse the expression
    let  expression  = ''   // string
    while(tokens.length>0 && tokens[0].type !== 'keyword'){ // jab tak next keyword na aa jae usse expression me add karte jao
        expression += tokens.shift().value;  // 10+20
    }
    declaration.value= expression.trim();
    }
  ast.body.push(declaration);
}

if (token.type==='keyword'&& token.value==='bol'){
    ast .body.push({        // agar keyword bol hua toh voh print statement hai
        type: 'print',
        expression: tokens.shift().value
    });
}

    }
    return ast
}

function codeGen(node){  // tree node will come to this  can be program, declaration. print
switch (node.type){
case'program': return node.body.map(codeGen)  .join('\n') ;       // map are loop on body of program   ,, fir join kardenge as a string with new line character          // we need to generate code of body of orogram
case 'Declaration' : return `const ${node.name}=${node.value};`
case 'print' : return `console.log(${node.expression})`  // print statement will return console.log
}


}




//makes code  (convert custom code in js)
function compiler(input){  // take input of source code
    const tokens = lexer (input);  // tokens lexer se banne ge, pehle lexer code kare ab
    const ast =parser(tokens);  // parser id=s a fxn to forn ast( abstract sentex tree)
    const executableCode = codeGen(ast)
    // console.log(tokens)
    // console.log(ast)
    // console.log(executableCode)  // convert our custom code into Js language which will further contact with
    return executableCode
}
// will execute our formed code
function runner(input){
    eval(input)
}

const code = `
ye x = 10
ye y=20
 ye sum = x+y
 bol sum

`
const exec =compiler(code) // we get exec after compilation
runner(exec)