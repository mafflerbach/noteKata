$(document).ready(function () {
    $('#new').click(function (e) {
        let uuid = guid();
        let clone = $($('#templates .card').parent().html()).attr('id', uuid).appendTo('#bin');
        appendClickHandler(uuid);
    });
    init();

});

function appendNotes(type) {

    let note = getStorage(type);
    let target = '#' + type;
    for (let i = 0; i < note.length; i++) {
        let parent = '#' + note[i].uuid;
        let titleSelector = '#' + note[i].uuid + ' .card-title';
        let contentSelector = '#' + note[i].uuid + ' .card-content';
        $($('#templates .card').parent().html()).attr('id', note[i].uuid).appendTo(target);
        $(titleSelector).val(note[i].title);
        $(contentSelector).val(note[i].content);
        $(parent).data('type', type);
        appendClickHandler(note[i].uuid);
    }
}

function init() {
    let bin = appendNotes('bin');
    let work = appendNotes('work');
    let done = appendNotes('done');
    let todo = appendNotes('todo');
}

function getNextType(type) {
    let newType = '';
    switch (type) {
        case 'bin':
            newType = 'todo'
            break;

        case 'todo':
            newType = 'work'
            break;

        case 'work':
            newType = 'done'
            break;
        default:
            break;
    }

    return newType;
}


function appendClickHandler(uuid) {
    function collectStorageData(uuid) {
        let selector_title = '#' + uuid + ' .card-title';
        let selector_content = '#' + uuid + ' .card-content';
        let title = $(selector_title).val();
        let content = $(selector_content).val();
        let type = $(parent).data('type');

        let note = {
            'uuid': uuid,
            'title': title,
            'content': content,
        }

        return {
            'note': note,
            'type': type
        };
    }

    function handleUpdate(storage, uuid, note, type) {
        if (isset(storage, uuid)) {
            storage = updateNote(storage, note);
        } else {
            storage.push(note);
        }
        saveStorage(storage, type)
        window.location.reload(true);
    }

    let uuidSelector = '#' + uuid + ' .save';
    let parent = '#' + uuid;

    $(uuidSelector).on('click', function (e) {
        let storageData = collectStorageData(uuid)
        let type = storageData.type;
        let note = storageData.note;

        storage = getStorage(type)
        handleUpdate(storage, uuid, note, type);
    });

    uuidSelector = '#' + uuid + ' .next';

    $(uuidSelector).on('click', function (e) {
        let storageData = collectStorageData(uuid)
        let type = storageData.type;
        let note = storageData.note;

        let newType = getNextType(type)
        $(parent).data('type', newType);

        storage = getStorage(type);
        removeFromStorage(note, type);

        nextStorage = getStorage(newType);
        handleUpdate(nextStorage, uuid, note, newType);

    });
}

function removeFromStorage(note, type) {
    let storage = getStorage(type)
    let tmp = new Array();

    for (let i = 0; i < storage.length; i++) {
        if (storage[i].uuid != note.uuid) {
            tmp.push(storage[i]);
        }
    }

    saveStorage(tmp, type);
}

function saveStorage(storage, type) {

    switch (type) {
        case 'bin':

            localStorage.bin = JSON.stringify(storage);
            break;
        case 'work':

            localStorage.work = JSON.stringify(storage);
            break;
        case 'todo':

            localStorage.todo = JSON.stringify(storage);
            break;
        case 'done':

            localStorage.done = JSON.stringify(storage);
            break;

        default:
            break;
    }

}

function getStorage(type) {

    let noteStorage = new Array();

    switch (type) {
        case 'bin':
            if (localStorage.bin !== undefined) {
                noteStorage = JSON.parse(localStorage.bin);
            }
            break;
        case 'work':

            if (localStorage.work !== undefined) {
                noteStorage = JSON.parse(localStorage.work);
            }
            break;
        case 'todo':
            if (localStorage.todo !== undefined) {
                noteStorage = JSON.parse(localStorage.todo);
            }
            break;
        case 'done':
            if (localStorage.done !== undefined) {
                noteStorage = JSON.parse(localStorage.done);
            }
            break;

        default:
            break;
    }

    return noteStorage;

}

function updateNote(noteStorage, note) {

    for (let i = 0; i < noteStorage.length; i++) {
        if (noteStorage[i].uuid == note.uuid) {
            noteStorage[i] = note;
        }
    }
    return noteStorage;
}

function isset(hystack, needel) {
    for (let i = 0; i < hystack.length; i++) {
        if (hystack[i].uuid == needel) {
            return true;
        }
    }
    return false;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}