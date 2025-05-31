module.exports = (plop) => {
  plop.setGenerator('ui-component', {
    description: 'uiディレクトリ用のReactコンポーネント雛形を作成',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'コンポーネント名（例: Button）を入力してください',
        validate: v => v ? true : '必須項目です',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/ui/{{pascalCase name}}/index.tsx',
        templateFile: 'plop-templates/index.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/ui/{{pascalCase name}}/index.stories.tsx',
        templateFile: 'plop-templates/index.stories.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/ui/{{pascalCase name}}/index.test.tsx',
        templateFile: 'plop-templates/index.test.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/ui/{{pascalCase name}}/index.module.css',
        templateFile: 'plop-templates/index.module.css.hbs',
      },
    ],
  });
}; 