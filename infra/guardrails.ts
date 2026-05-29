const BUDGET_BY_STAGE: Record<string, number> = {
  production: 100,
  staging: 50,
};

const limit = BUDGET_BY_STAGE[$app.stage] ?? 25;
const alertEmail = 'giacomo.rossi@travelware.tech';
const budgetName = `risparmiocasa-${$app.stage}-budget`;

new aws.budgets.Budget('Budget', {
  name: budgetName,
  budgetType: 'COST',
  limitAmount: String(limit),
  limitUnit: 'USD',
  timeUnit: 'MONTHLY',
  costFilters: [
    {
      name: 'TagKeyValue',
      values: [`sst:app$${$app.name}`, `sst:stage$${$app.stage}`],
    },
  ],
  notifications: [
    {
      comparisonOperator: 'GREATER_THAN',
      threshold: 50,
      thresholdType: 'PERCENTAGE',
      notificationType: 'ACTUAL',
      subscriberEmailAddresses: [alertEmail],
    },
    {
      comparisonOperator: 'GREATER_THAN',
      threshold: 80,
      thresholdType: 'PERCENTAGE',
      notificationType: 'ACTUAL',
      subscriberEmailAddresses: [alertEmail],
    },
    {
      comparisonOperator: 'GREATER_THAN',
      threshold: 100,
      thresholdType: 'PERCENTAGE',
      notificationType: 'FORECASTED',
      subscriberEmailAddresses: [alertEmail],
    },
  ],
});

export const guardrails = { budgetName };
