var leds = [];

function clearLeds()
{
    for(var i = 0; i < leds.length; i = i + 1)
    {
        leds[i].className = "dot";
    }
}

function ledOn(x, y)
{
    leds[8 * x + y].className = "dotlit";
}

function ledOff(x, y)
{
    leds[8 * x + y].className = "dot";
}

function ledError(x, y)
{
    leds[8 * x + y].className = "doterror";
}

function loadAnimIntoLeds(anim)
{
    var pos;

    clearLeds();

    for(var y = 0; y < 8; ++y)
    {
        for(var x = 0; x < 8; ++x)
        {
            pos = 8 * y + x;
            pos += y + 1;   // account for leading 'B's
            pos += y * 2;   // account for trailing ',\n's
            if(anim[pos] == 1)
                ledOn(x, y);
            else if(anim[pos] != 0)
                ledError(x, y);
        }
    }
}

function writeAnimOut()
{
    var animOut = document.getElementsByClassName("animout")[0];

    if(animOut.value != "")
        animOut.value = "";

    for(var i = 0; i < 8; i = i + 1)
    {
        var line = "B";

        for(var j = 0; j < 8; j = j + 1)
        {
            if(leds[j * 8 + i].className == "dot")
                line = line + "0";
            else
                line = line + "1";
        }

        line = line + ",\n";
        animOut.value += line;
    }
    animOut.value += "25,";
}

function clearAnimOut()
{
    document.getElementsByClassName("animout")[0].value = "";
}

function sortAnimList()
{
    var savedAnims = document.getElementsByClassName("savedanims")[0];
    var tmpAry = new Array();

    for(var i = 0; i < savedAnims.options.length; ++i)
    {
        tmpAry[i] = new Array();
        tmpAry[i][0] = savedAnims.options[i].text;
        tmpAry[i][1] = savedAnims.options[i].value;
    }

    tmpAry.sort();

    while(savedAnims.options.length > 0)
        savedAnims.options[0] = null;

    for(var i = 0; i < tmpAry.length; ++i)
    {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        savedAnims.options[i] = op;
    }
}

function initAnims()
{
    var keyStr;

    for(var i = 0; i < localStorage.length; i += 1)
    {
        keyStr = localStorage.key(i);
        if(keyStr.substring(0, 5) == "dots-")
        {
            addAnimToList(keyStr.substring(5,99));
        }
    }

    sortAnimList();
}

function addAnimToList(anim)
{
    var savedAnims = document.getElementsByClassName("savedanims")[0];

    for(var i = 0; i < savedAnims.length; i++)
    {
        if(savedAnims.options[i].value == anim)
        {
            savedAnims.remove(i);
            break;
        }
    }

    var option = document.createElement("option");
    option.value = anim;
    option.text = anim;

    savedAnims.add(option);

    sortAnimList();
}

function updateSaveName()
{
    var savedAnims = document.getElementsByClassName("savedanims")[0];
    var saveName = document.getElementsByName("savename")[0];

    saveName.value = savedAnims.value;
}

function saveAnim()
{
    var animOut = document.getElementsByClassName("animout")[0];
    var savedAnims = document.getElementsByClassName("savedanims")[0];
    var saveName = document.getElementsByName("savename")[0];

    if(animOut.value == "")
        return alert("Can not save an empty anim. Write Anim first.");

    if(saveName.value == "")
    {
        saveName.focus();
        return alert("Can not save an anim without a name.");
    }

    hasSave = localStorage.getItem("dots-" + saveName.value);
    if(hasSave != null)
        localStorage.removeItem("dots-" + saveName.value);

    localStorage.setItem("dots-" + saveName.value, animOut.value);
    addAnimToList(saveName.value);
}

function loadAnim()
{
    var animOut = document.getElementsByClassName("animout")[0];
    var saveName = document.getElementsByName("savename")[0];

    var loadedAnim = localStorage.getItem("dots-" + saveName.value);
    if(loadedAnim == null)
        return alert("Unable to load anim \"" + saveName.value + "\".");

    animOut.value = "";
    animOut.value += loadedAnim;
    loadAnimIntoLeds(loadedAnim);
}

function deleteAnim()
{
    var savedAnims = document.getElementsByClassName("savedanims")[0];
    var saveName = document.getElementsByName("savename")[0];
    var anim = saveName.value;

    for(var i = 0; i < savedAnims.length; i++)
    {
        if(savedAnims.options[i].value == anim)
        {
            localStorage.removeItem("dots-" + anim);
            savedAnims.remove(i);
            return;
        }
    }

    alert("Anim \"" + anim + "\" does not exist.");
}

function buildDotsDiv()
{
    var div = document.getElementsByClassName("dots")[0];
    var tbl = document.createElement("table");
    var tbdy = document.createElement("tbody");

    var tr = document.createElement("tr");
    var td = document.createElement("td");
    var ledDiv = document.createElement("div");
    ledDiv.setAttribute("class", "ledpanel");
    td.appendChild(ledDiv);
    tr.appendChild(td);
    td = document.createElement("td");
    var animoutText = document.createElement("textarea");
    animoutText.setAttribute("class", "animout");
    animoutText.setAttribute("cols", "10");
    animoutText.setAttribute("rows", "9");
    td.appendChild(animoutText);
    tr.appendChild(td);
    td = document.createElement("td");
    var savedSelect = document.createElement("select");
    savedSelect.setAttribute("class", "savedanims");
    savedSelect.setAttribute("onchange", "updateSaveName()");
    td.appendChild(savedSelect);
    tr.appendChild(td);
    tbdy.appendChild(tr);

    tr = document.createElement("tr");
    td = document.createElement("td");
    var button = document.createElement("button");
    button.addEventListener("click", clearLeds);
    //button.setAttribute("value", "Reset LEDs");
    //button.setAttribute("name", "Reset LEDs");
    button.type = "button";
    button.appendChild( document.createTextNode( 'Reset LEDs' ) );
    td.appendChild(button);
    tr.appendChild(td);
    td = document.createElement("td");
    button = document.createElement("button");
    button.addEventListener("click", writeAnimOut);
    button.appendChild( document.createTextNode( 'Generate Code' ) );
    button.type = "button";
    td.appendChild(button);
    tr.appendChild(td);
    td = document.createElement("td");
    button = document.createElement("button");
    button.addEventListener("click", loadAnim);
    button.appendChild(document.createTextNode( 'Load Frame' ) );
    button.type = "button";
    td.appendChild(button);
    tr.appendChild(td);
    td = document.createElement("td");
    var label = document.createElement("label");
    label.value = "Frame Name";
    td.appendChild(label);
    tr.appendChild(td);
    tbdy.appendChild(tr);

    tr = document.createElement("tr");
    td = document.createElement("td");
    td.appendChild( document.createTextNode( '\u00A0' ) );
    tr.appendChild(td);
    td = document.createElement("td");
    button = document.createElement("button");
    button.addEventListener("click", clearAnimOut);
    button.appendChild( document.createTextNode( 'Clear Code' ) );
    button.type = "button";
    td.appendChild(button);
    tr.appendChild(td);
    td = document.createElement("td");
    button = document.createElement("button");
    button.addEventListener("click", saveAnim);
    button.appendChild( document.createTextNode( 'Save Frame' ) );
    button.type = "button";
    td.appendChild(button);
    tr.appendChild(td);
    td = document.createElement("td");
    var saveInput = document.createElement("input");
    saveInput.type = "text";
    saveInput.name = "savename";
    td.appendChild(saveInput);
    tr.appendChild(td);
    tbdy.appendChild(tr);

    tr = document.createElement("tr");
    td = document.createElement("td");
    td.appendChild( document.createTextNode( '\u00A0' ) );
    tr.appendChild(td);
    td = document.createElement("td");
    td.appendChild( document.createTextNode( '\u00A0' ) );
    tr.appendChild(td);
    td = document.createElement("td");
    button = document.createElement("button");
    button.addEventListener("click", deleteAnim);
    button.appendChild( document.createTextNode( 'Delete Frame' ) );
    button.type = "button";
    td.appendChild(button);
    tr.appendChild(td);
    tbdy.appendChild(tr);

    tbl.appendChild(tbdy);
    div.appendChild(tbl);
}

window.onload = function setupWindow()
{
    buildDotsDiv();
    var theDiv = document.getElementsByClassName("ledpanel")[0];
    var savedAnims = document.getElementsByClassName("savedanims")[0];

    for(var i = 0; i < 8; i = i + 1)
    {
        for(var j = 0; j < 8; j = j + 1)
        {
            var dot = document.createElement("div");
            leds[leds.length] = dot;
            dot.className = "dot";
            dot.style.left = (i * 18 + 1) + "px";
            dot.style.top = (j * 18 + 1) + "px";
            dot.addEventListener("click", function(event) {
                if(this.className == "dot")
                    this.className = "dotlit";
                else
                    this.className = "dot";});
            theDiv.appendChild(dot);
        }
    }

    var blank = document.createElement("option");
    blank.text = "";
    blank.value = "";
    savedAnims.add(blank);
    initAnims();
}