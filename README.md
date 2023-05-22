# Email Automation

This handles spinning up the droplets, managing the files, and tearing down the droplets with simple command line scripts. The idea is to make it less error-prone and tedious to prepare an email blast.

## Requirements

- You will need to have the [1Password CLI](https://developer.1password.com/docs/cli/get-started/) installed.
- You will need to configure the environment variables. Ensure they are loaded into your 1Password - update the references in `prod.env` and `mongo.env` accordingly.
- You will need to have the [DigitalOcean CLI](https://docs.digitalocean.com/reference/doctl/) installed.
- You will need to auth the `doctl` CLI, setting the `--context` to `fcc` (the commands rely on this auth context name.)
- You will need an SSH key available in your DigitalOcean account.
- You will need the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html), which you should [authenticate with SSO](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html#cli-configure-sso-configure). Name the profile `freeCodeCamp` for this tool to work correctly.

## Dependencies

- The database query uses our [pre-existing script](https://github.com/freeCodeCamp/scripts/blob/main/accounts/get-emails.js).
- The email blast uses our [SES CLI tool](https://github.com/freecodecamp/ses-email-blast)

## Usage

You'll need to start by configuring the environment variables for the email blast servers themselves. Copy the `mongo.env` from the `templates` directory to the `data` directory and fill in the values. Add an `emailBody.txt` file to the `data` directory and fill in the email body.

### Getting the Email List

#### Spin up the DB droplet

To run the database query, you'll first need a droplet to do so. Typically you want to run the DB query the day before the blast, to avoid delaying your send. Run `pnpm db:setup` to spin up the droplet.

#### Prepare the DB droplet

Running `pnpm db:files` will load the necessary files to the query droplet, and give you instructions for running the query.

#### Teardown the DB droplet

Once the database query is complete, run `pnpm db:teardown` to download the email list and automatically destroy the droplet to save costs.

### Running the Blast

#### Spin up the droplets

Run `pnpm emails:setup` to spin up new droplets. The script will automatically grant access to the configured ssh key, and assign the droplets to the configured project.

#### Initialise the files

Run `pnpm emails:files` to initialise the files on the droplets. This will copy the `emails.env` and `emailBody.txt` files to the droplets. This will pull down the full email list from the query, and batch it into files of equivalent size (or as close as it can), one for each droplet. It will push the email lists up to each droplet. Then you can ssh into each droplet and start the sending process.

#### Clean up

When the blast is complete, run `pnpm emails:teardown` to destroy the droplets, and `pnpm scripts:clean` to remove your sensitive local files. This minimises the risk that private data may be exposed.

### Blocking Accounts

When a spam report for our email blast comes back through AWS, you need to prevent further emails to that address. Run `pnpm scripts:block <email>` to add the account to the suppression list and unsubscribe them from the newsletter in the database.
