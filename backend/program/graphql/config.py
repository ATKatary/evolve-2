from ariadne import load_schema_from_path
from program.graphql import mutations, queries, subscriptions
from src.graphql.types import query, mutation, subscription

type_defs = [
    load_schema_from_path("program/graphql/base.graphql")
]

# Program
query.set_field("program", queries.ProgramQueries.get)
query.set_field("programProgress", queries.ProgramQueries.progress)

mutation.set_field("createProgram", mutations.ProgramMutations.create)
mutation.set_field("updateProgram", mutations.ProgramMutations.update)
mutation.set_field("deleteProgram", mutations.ProgramMutations.delete)

subscription.set_source("watchProgram", subscriptions.ProgramSubscriptions.watch)
subscription.set_field("watchProgram", subscriptions.ProgramSubscriptions.resolve)

# Module
query.set_field("module", queries.ModuleQueries.get)
query.set_field("moduleProgress", queries.ModuleQueries.progress)

mutation.set_field("createModule", mutations.ModuleMutations.create)
mutation.set_field("updateModule", mutations.ModuleMutations.update)
mutation.set_field("submitModule", mutations.ModuleMutations.submit)
mutation.set_field("unsubmitModule", mutations.ModuleMutations.unsubmit)
mutation.set_field("checkInModule", mutations.ModuleMutations.check_in)
mutation.set_field("deleteModule", mutations.ModuleMutations.delete)

subscription.set_source("watchModule", subscriptions.ModuleSubscriptions.watch)
subscription.set_field("watchModule", subscriptions.ModuleSubscriptions.resolve)

# Step 
query.set_field("step", queries.StepQueries.get)

mutation.set_field("updateStep", mutations.StepMutations.update)

subscription.set_source("watchStep", subscriptions.StepSubscriptions.watch)
subscription.set_field("watchStep", subscriptions.StepSubscriptions.resolve)

# Entry 
mutation.set_field("createEntry", mutations.EntryMutations.create)
mutation.set_field("updateEntry", mutations.EntryMutations.update)
mutation.set_field("deleteEntry", mutations.EntryMutations.delete)
mutation.set_field("respondEntry", mutations.EntryMutations.respond)
