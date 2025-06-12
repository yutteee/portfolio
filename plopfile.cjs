module.exports = (plop) => {
  plop.setGenerator('ui-component', {
    description: '見た目だけの汎用的なコンポーネントを作成',
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
        templateFile: 'plop-templates/ui/index.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/ui/{{pascalCase name}}/index.stories.tsx',
        templateFile: 'plop-templates/ui/index.stories.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/ui/{{pascalCase name}}/index.test.tsx',
        templateFile: 'plop-templates/ui/index.test.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/ui/{{pascalCase name}}/index.module.css',
        templateFile: 'plop-templates/ui/index.module.css.hbs',
      },
    ],
  });

  plop.setGenerator('feature-component', {
    description: '特定の機能を実現するコンポーネントの作成',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'コンポーネント名（例: Footer）を入力してください',
        validate: v => v ? true : '必須項目です',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/features/{{pascalCase name}}/index.tsx',
        templateFile: 'plop-templates/features/index.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{pascalCase name}}/presenter.tsx',
        templateFile: 'plop-templates/features/presenter.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{pascalCase name}}/index.module.css',
        templateFile: 'plop-templates/features/index.module.css.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{pascalCase name}}/index.stories.tsx',
        templateFile: 'plop-templates/features/index.stories.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/features/{{pascalCase name}}/index.test.tsx',
        templateFile: 'plop-templates/features/index.test.tsx.hbs',
      },
    ],
  });
}; 