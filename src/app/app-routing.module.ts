import {RouterModule, Routes} from "@angular/router";
import {RecipesComponent} from "./recipes/recipes.component";
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";
import {NgModule} from "@angular/core";
import {RecipeStartComponent} from "./recipes/recipe-start/recipe-start.component";
import {RecipeDetaiComponent} from "./recipes/recipe-detai/recipe-detai.component";
import {RecipeEditComponent} from "./recipes/recipe-edit/recipe-edit.component";
import { RecipeResolveService } from "./recipes/recipe-start/recipe-resolver.service";
import {AuthComponent} from "./auth/auth.component";
import {AuthGuard} from "./auth/auth.guard";


const appRoutes: Routes = [
  { path: '', redirectTo: '/recipe', pathMatch: 'full' },
  { path: 'recipe',  component: RecipesComponent, canActivate: [AuthGuard], children:[
      { path: '', component: RecipeStartComponent },
      { path: 'new', component: RecipeEditComponent },
      { path: ':id', component: RecipeDetaiComponent, resolve: [RecipeResolveService] },
      { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipeResolveService] },
    ]},
  { path: 'shopping-list', component: ShoppingListComponent },
  {path: 'auth', component: AuthComponent}

]
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule],
})

export class AppRoutingModule {

}
