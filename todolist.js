/**
 * Javascript solution for Todo list by Alina Holz
 */


//Getting all the required items from the HTML
document.addEventListener("DOMContentLoaded", function () {

    const taskArray = []; //the array we use for all of our tasks


    let form = document.getElementById("newTask");
    let taskName = document.getElementById("name");
    let datePicker = document.getElementById("picker");
    let priority = document.getElementById("prio");

    //Add event listener to the sort option so that the view updates accordingly
    const sort = document.getElementById("sel1");
    sort.addEventListener("change", () => updateView());


    // Add event listener to form submit button
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        //getting values from submitted items
        let name = taskName.value;
        let dueDate = datePicker.value;
        let prio = priority.value;

        // Check if the task name input is empty
        //!!!There are no other input checks becaus I made the input idiot - safe
        //(using datePicker, selecting the value of priority from a list)
        if (name.trim() === '') {
            //Tell user to input a name
            alert("Task name cannot be empty!");
        } else {
            //Add new task because requirements are met
            addNewTask(name, dueDate, prio); 
        }
    });

    function addNewTask(name, dueDate, prio){

        //Date object definition
        let date;

        if(dueDate.trim() === ''){
            //If dueDate was not given we set it to tomorrow
            let currentDate = new Date();
            date = new Date(currentDate);
            date.setDate(currentDate.getDate() + 1);
        }else{
            //else we convert our date String into a date Object
            let dateComponents = dueDate.split('/');
            date = new Date(dateComponents[2], dateComponents[0] - 1, dateComponents[1]);
        }

        let taskNumber = taskArray.length + 1; //generate task number by using number of existing tasks
        let isFinished = false; //value for completition is false at first

        //create a Task object, push it into the array and update the view accordingly
        const task = {number: taskNumber, taskName: name, endDate: date, priority: prio, status: isFinished};
        taskArray.push(task);
        updateView();
    }

    function updateView(){

        //get the task table
        const table = document.getElementById("taskTable");

        //get the value of the sort option
        let sort = document.getElementById("sel1").value;
        
        //Sort array according to selected sort option
        if(sort == "Number"){
            taskArray.sort((t1, t2) => (t1.number > t2.number) ? 1 : (t1.number < t2.number) ? -1 : 0);
        }else if(sort == "Name"){
            taskArray.sort((t1, t2) => (t1.taskName > t2.taskName) ? 1 : (t1.taskName < t2.taskName) ? -1 : 0);
        }else if(sort == "Priority(highest first)"){
            taskArray.sort((t1, t2) => (t1.priorityx < t2.priority) ? 1 : (t1.priority > t2.priority) ? -1 : 0);
        }else if(sort =="Due date(earliest first)"){
            taskArray.sort((t1, t2) => (t1.endDate > t2.endDate) ? 1 : (t1.endDate < t2.endDate) ? -1 : 0);
        }else{
            taskArray.sort((t1, t2) => {
                if (t1.status === t2.status) {
                    return 0; 
                } else if (t1.status === false) {
                    return -1; 
                } else {
                    return 1;
                }
            });
        }

        //Removing all existing elements first to avoid doubles/mistakes later
        const rows = table.querySelectorAll("tr");

        // Start from the second row (index 1) to avoid removing the table headers (index 0)
        for (let i = 1; i < rows.length; i++) {
            table.removeChild(rows[i]);
        }


        //Iterate through our task array
        taskArray.forEach(task => {

            const tableRow = document.createElement("tr");
            tableRow.id = task.number; //Assigning the same numbers to the table rows as to the tasks to find them more easily later

            //Strike out task if it is completed
            if (task.status) {
                tableRow.style.textDecoration = "line-through";
            }

            //format date first for better display
            const options = { day: '2-digit', month: '2-digit', year: 'numeric'};
            let dateString = task.endDate.toLocaleDateString(undefined, options);

            //Create all the table elements and add the text
            const para1 = document.createElement("td");
            const text1 = document.createTextNode(task.number);
            para1.appendChild(text1);

            const para2 = document.createElement("td");
            const text2 = document.createTextNode(task.taskName);
            para2.appendChild(text2);

            const para3 = document.createElement("td");
            const text3 = document.createTextNode(task.priority);
            para3.appendChild(text3);

            const para4 = document.createElement("td");
            const text4 = document.createTextNode(dateString);
            para4.appendChild(text4);

            //Make a checkbox for the status
            const para5 = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            //Check/Disable checkbox to lock task if it is already done
            checkbox.checked = task.status;
            checkbox.disabled = task.status;


            //If the user clicks an enabled checkbox the task can only be undone, so we change it to done and update the view
            checkbox.addEventListener("click", function() {
                    task.status = true;
                    updateView();
            });

            para5.appendChild(checkbox);

            //Append all table elements to created row and then row to table
            tableRow.append(para1, para2, para3, para4, para5);
            table.appendChild(tableRow);

        });
    }


});

