// Static words
let _output = {
    "error_dismiss-action": "Ok",
    "header_app-name": "Ngx Components",
    "header_app-short-name": "Components",
    "header_action-logout": "Logout",
    "footer_tag-line": "© {{year}} - Tractr",
    "session_sign-in": "Sign in",
    "session_email": "Email",
    "session_password": "Password",
    "home_title": "Components",
    "common_any": "Any",
    "common_true": "Yes",
    "common_false": "No",
    "common_save": "Save",
    "common_edit": "Edit",
    "common_create": "Create",
    "common_delete": "Delete",
    "common_error-required": "This field is required",
    "common_error-format": "Wrong format",
};

/**
 * Generate the read part of a model
 *
 * @param model
 * @private
 */
function __fields(model) {
    const modelKey = model.names.kebab;
    return model.fields.list
        .filter((f) => !((f.hidden && (f.internal || f.restricted)) || f.primary))
        .reduce((p, f) => {
            const key = f.names.kebab;
            p[`${modelKey}_${key}`] = `${f.names.capital}`;
            return p;
        }, {});
}

/**
 * Generate the filter of a model
 *
 * @param model
 * @private
 */
function __filter(model) {
    const modelKey = model.names.kebab;
    return model.fields.searchable
        .reduce((p, f) => {
            const key = f.names.kebab;
            p[`${modelKey}_${key}`] = `${f.names.capital}`;
            if (f.type === 'number' || f.type === 'datetime') {
                p[`${modelKey}_${key}--min`] = `${f.names.capital} min`;
                p[`${modelKey}_${key}--max`] = `${f.names.capital} max`;
            }
            return p;
        }, {});
}

/**
 * Generate the selector of a model
 *
 * @param model
 * @private
 */
function __select(model) {
    if (model.p.hasSearchableLabel) {
        return {
            [`${model.names.kebab}_common_search-placeholder`]: `Search ${model.names.lower}`
        };
    }
    return {};
}

/**
 * Generate a model
 *
 * @param model
 * @private
 */
function __model(model) {
    const modelKey = model.names.kebab;
    const modelWords = model.names.lower;
    return Object.assign(
        {
            [`${modelKey}_common_name`]: model.names.capital,
            [`${modelKey}_common_not-found`]: `No ${modelWords} found`,
        },
        __filter(model),
        __fields(model),
        __select(model)
    );
}


//--------------------------------------------------
//  Output
//--------------------------------------------------
models.map((model) => {
    const keysUnordered = Object.assign(_output, __model(model));

    _output = Object.keys(keysUnordered).sort().reduce(function(keysOrdered, key) {
      keysOrdered[key] = keysUnordered[key];

      return keysOrdered;
    }, {});
});
return JSON.stringify(_output, null, 2);
