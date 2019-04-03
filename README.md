# Angular Components Boileplate

This boilerplate provides a components library built with Angular 7.

> This boilerplate is meant to be used with Hapify. To get more info about Hapify setup, please refer to https://www.hapify.io/get-started.

## Get Started

### 1. Clone repository

-   **Option 1**: Clone and configure this boilerplate using command `hpf new --boilerplate ngx_components_tractr`.
-   **Option 2**: You can clone this repository and change the project id in file `hapify.json` by running command `hpf use`.

### 2. Generate code

Then you need to generate code from your Hapify project using `hpf generate`.

**Important**: For development purpose, generated files are ignored in the `.gitignore`. You should edit this file and remove the last lines before committing.

### 3. API Dependency

This project depends on the [`hapijs_tractr`](https://github.com/Tractr/boilerplate-hapijs) API Boilerplate. Please install and start the API before running Angular Component.

### 4. Start project

Once the API is started, you can start the project:

```bash
npm start
```

## Advanced Integration

This boilerplate includes a user sessions management.
