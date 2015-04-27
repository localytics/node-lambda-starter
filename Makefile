delete:
	aws lambda delete-function \
		--region us-east-1 \
		--function-name s3-kinesis-lambda-starter

get:
	aws lambda get-function \
		--region us-east-1 \
		--function-name s3-kinesis-lambda-starter

invoke:
	aws lambda invoke-async \
		--region us-east-1 \
		--function-name s3-kinesis-lambda-starter \
		--invoke-args $(payload)

list:
	aws lambda list-functions \
		--region us-east-1

list-event-sources:
	aws lambda list-event-sources \
		--region us-east-1

update:
	@npm install
	@zip -r ./MyLambda.zip * -x *.json *.zip test.js
	aws lambda update-function-code \
		--region us-east-1 \
		--function-name s3-kinesis-lambda-starter \
		--zip-file fileb://MyLambda.zip

upload:
	@npm install
	@zip -r ./MyLambda.zip * -x *.json *.zip test.js
	aws lambda create-function \
		--region us-east-1 \
		--function-name s3-kinesis-lambda-starter \
		--zip-file fileb://MyLambda.zip \
		--handler MyLambda.handler \
		--runtime nodejs \
		--role arn:aws:iam::$(shell echo $(AWS_ACCOUNT_ID)):role/lambda_basic_execution \

test:
	@npm test

.PROXY: delete get invoke list list-event-sources update upload test
