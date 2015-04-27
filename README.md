S3 / Kinesis Lambda Starter
---------------------------

A starter module for an AWS Lambda that can handle S3 PUT notifications and
Kinesis stream events.

This module is intended to be copied and edited as your own Lambda function.
The utilities within this repo are focused around creating and maintaining
_a single_ Lambda function.

[Read the accompanying blog post here](http://eng.localytics.com/).

#### Install

- `npm install`

#### Test

- `npm test`

#### Deploy

First, set your `AWS_ACCOUNT_ID` environment variable:

- bash: `export AWS_ACCOUNT_ID=123`
- fish: `set -x AWS_ACCOUNT_ID 123`

**Permissions:**

There are two specific permissions that you'll likely need.

- User permission for `iam:PassRole`. This policy needs to be applied to the
  user who is _creating_ the Lambda:

```
{
  "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "Stmt1429124462000",
        "Effect": "Allow",
        "Action": [
          "iam:PassRole"
        ],
        "Resource": [
          "arn:aws:iam::<account_id>:role/lambda_basic_execution"
        ]
      }
    ]
}
```

- Lambda execution role. You need to create a new role that the Lambda will
  run as. We assume that role is named `lambda_basic_execution` for the purposes
  of this project. That role must have (at least) this policy applied:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:*"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

This policy allows the `lambda_basic_execution` role to manage CloudWatch logs
for our Lambda's execution.

**Upload:**

- `make upload`

**Connect an S3 bucket:**

To connect an S3 bucket to the Lambda function, you must use the
[AWS UI](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions).

**Connect a Kinesis stream:**

To connect a Kinesis stream to the Lambda function, run the following:

```
aws lambda add-event-source \
   --region <region> \
   --function-name <lambda-function-name> \
   --role arn:aws:iam::<account-number>:role/<role-name> \
   --event-source arn:aws:kinesis:<region>:<account-number>:stream/<kinesis-stream-name> \
   --batch-size 100 \
   --profile <cli-profile-name>
```

*Note: `cli-profile-name` is whatever block you've named your credentials in
`~/.aws/credentials`. It is `default` by default.*

#### Utilities

We've defined some useful utilities in the Makefile which can make uploading,
updating, and invoking this Lambda a little easier.

*Note: We have hardcoded the region and function name into the Makefile for this
module. You'll want to modify this if you plan to change the function name or
use a region other than `us-east-1`.*

- `make delete` - will remove this Lambda from AWS.
- `make get` - will retrieve the details of this function on AWS.
- `make invoke` - will invoke this Lambda on AWS with the provided data file.
- `make list` - will list all of the Lambda functions on this account for the
  given region.
- `make list-event-sources` - will list event sources for this Lambda.
- `make update` - will re-upload this Lambda package without overwriting the
  function's configuration details.
- `make upload` - will upload this Lambda function for the first time.
