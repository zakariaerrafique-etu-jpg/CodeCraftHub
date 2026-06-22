const API = "/api/courses";

let modal = null;

document.addEventListener("DOMContentLoaded", () => {

    loadCourses();

    const modalElement = document.getElementById("courseModal");

    if (modalElement) {
        modal = new bootstrap.Modal(modalElement);
    }

});

async function loadCourses() {

    const response = await fetch(API);

    const courses = await response.json();

    const table = document.getElementById("courseTable");

    table.innerHTML = "";

    courses.forEach(course => {

        table.innerHTML += `
        <tr>

            <td>${course.id}</td>

            <td>${course.title}</td>

            <td>${course.level}</td>

            <td>

                <button
                    class="btn btn-primary btn-sm"
                    onclick="handleEdit(${course.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="handleDelete(${course.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>

            </td>

        </tr>
        `;

    });

}

function showAddForm(){

    document.getElementById("courseId").value="";

    document.getElementById("title").value="";

    document.getElementById("level").value="Beginner";

    modal.show();

}

async function saveCourse(){

    const id=document.getElementById("courseId").value;

    const title=document.getElementById("title").value;

    const level=document.getElementById("level").value;

    const data={title,level};

    if(id==""){

        await fetch(API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });

    }else{

        await fetch(`${API}/${id}`,{

            method:"PUT",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });

    }

    modal.hide();

    loadCourses();

}

async function handleEdit(id){

    const response=await fetch(API);

    const courses=await response.json();

    const course=courses.find(c=>c.id===id);

    if(!course) return;

    document.getElementById("courseId").value=course.id;

    document.getElementById("title").value=course.title;

    document.getElementById("level").value=course.level;

    modal.show();

}

async function handleDelete(id){

    if(!confirm("Delete this course ?"))
        return;

    await fetch(`${API}/${id}`,{
        method:"DELETE"
    });

    loadCourses();

}

function searchCourse(){

    const keyword=document
        .getElementById("search")
        .value
        .toLowerCase();

    const rows=document.querySelectorAll("#courseTable tr");

    rows.forEach(row=>{

        row.style.display=
            row.innerText.toLowerCase().includes(keyword)
            ?"":"none";

    });

}