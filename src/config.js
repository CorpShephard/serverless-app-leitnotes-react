const dev = {
  s3: {
    REGION: "us-east-2",
    BUCKET: "notes-app-2-api-dev-attachmentsbucket-1l8fib0z0hxas"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://5mlyd4f15e.execute-api.us-east-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_IudBI3rXt",
    APP_CLIENT_ID: "7a5i7jhsvtpo8lilfvdtmgt6qk",
    IDENTITY_POOL_ID: "us-east-2:7f07c529-3a2e-4ee4-acf9-4c0a17b6c686"
  }
};

const prod = {
  s3: {
    REGION: "us-east-2",
    BUCKET: "notes-app-2-api-prod-attachmentsbucket-1xr1y8p19lpww"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://rg345gmax2.execute-api.us-east-2.amazonaws.com/prod"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_1X0F9ASuO",
    APP_CLIENT_ID: "7301mgb3brqf11vld762aq1f4o",
    IDENTITY_POOL_ID: "us-east-2:97105c78-c00e-4cdd-9290-a0afa98fab9b"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};